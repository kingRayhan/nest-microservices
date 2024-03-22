import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageBrokerModule } from './common/message-broker/message-broker.module';

@Module({
  imports: [
    MessageBrokerModule.register({
      host: 'amqp://localhost:5672',
      queue: 'ecommerce',
      globalExchangeName: 'GlobalFanoutExchange',
      // auth: {
      //   username: 'dinebd',
      //   password: '@@1100AAaa##',
      // },
      acceptableEvents: ['user.created', 'user.updated', 'cart.updated'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
