import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageBrokerModule } from './common/message-broker/message-broker.module';

@Module({
  imports: [
    MessageBrokerModule.register({
      host: 'amqp://localhost:5672',
      queue: 'rider',
      globalExchangeName: 'GlobalFanoutExchange',
      // auth: {
      //   username: 'guest',
      //   password: 'guest',
      // },
      acceptableEvents: ['user.created', 'user.updated', 'rider.updated'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
