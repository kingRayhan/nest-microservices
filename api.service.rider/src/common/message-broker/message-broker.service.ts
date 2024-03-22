import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { MODULE_OPTIONS_TOKEN, RegisterOptions } from './module-definition';
import { Message } from './contracts/Message';
import { randomUUID } from 'crypto';

@Injectable()
export class MessageBrokerService implements OnModuleInit {
  public channel: amqplib.Channel;
  public connection: amqplib.Connection;
  public logger = new Logger(MessageBrokerService.name);
  private listenerMap: Map<string, (data: string, ack: () => void) => void> =
    new Map();

  constructor(@Inject(MODULE_OPTIONS_TOKEN) public options: RegisterOptions) {}

  async onModuleInit() {
    try {
      const amqpServer = this.options.host;
      this.connection = await amqplib.connect(amqpServer, {
        credentials: this.options.auth
          ? amqplib.credentials.plain(
              this.options.auth.username,
              this.options.auth.password,
            )
          : undefined,
        clientProperties: { connection_name: this.options.queue },
      });
      this.channel = await this.connection.createChannel();
      this.logger.debug('Connected to RabbitMQ');

      this.channel.assertExchange(this.options.globalExchangeName, 'fanout');

      // assert current app queue
      this.channel.assertQueue(this.options.queue, { durable: true });

      // bind current app queue with global exchange
      await this.channel.bindQueue(
        this.options.queue,
        this.options.globalExchangeName,
        '',
      );

      this.channel.consume(this.options.queue, (msg) => {
        const _msg: Message<string> = JSON.parse(msg.content.toString());

        if (this.listenerMap.has(_msg.event)) {
          const listenerOnMessage = this.listenerMap.get(_msg.event);
          listenerOnMessage(msg.content.toString(), () => {
            this.channel.ack(msg);
            this.logger.debug(`ack the event: ${_msg.event}`);
          });
        } else {
          this.logger.debug(`ignore irrelevant event: ${_msg.event}`);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      this.logger.error('RabbitMQ connection error', error.message);
    }
  }

  async listen(
    event: string,
    onMessage: (data: string, ack: () => void) => void,
  ) {
    if (this.listenerMap.has(event)) return;
    this.listenerMap.set(event, onMessage);
  }

  async emit(event: string, data: string) {
    const id = randomUUID();
    const time = new Date().toISOString();
    const message = new Message(id, time, event, this.options.queue, data);

    this.channel.publish(
      this.options.globalExchangeName,
      '',
      Buffer.from(JSON.stringify(message)),
    );

    this.logger.debug(JSON.stringify(message));
  }
}
