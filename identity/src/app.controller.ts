import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RMQ_CLIENT') private rmqClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  register() {
    // send message to queue

    this.rmqClient.send('user_created', {
      id: Date.now(),
      name: 'Rayhan',
    });

    return {
      message: 'Registered successfully',
    };
  }
}
