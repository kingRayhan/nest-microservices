import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageBrokerService } from './common/message-broker/message-broker.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly msgBroker: MessageBrokerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  register() {
    // send message to queue

    this.msgBroker.emit(
      'no',
      JSON.stringify({
        id: Date.now(),
        type: 'order.accepted',
        payload: { time: Date.now() },
      }),
    );

    return {
      message: 'Registered successfully',
    };
  }
}
