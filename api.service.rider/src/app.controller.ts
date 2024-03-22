import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageBrokerService } from './common/message-broker/message-broker.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    private readonly msgBroker: MessageBrokerService,
  ) {}
  onModuleInit() {
    this.msgBroker.listen('*', (data, ack) => {
      console.log('user.created');
      console.log(JSON.parse(data));
      /// await Business
      ack();
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
