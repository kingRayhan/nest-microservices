import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queueOptions: {
        durable: false,
      },
      queue: 'dinebd',
    },
  });

  await app.startAllMicroservices();
  await app.listen(4002);
  console.log('identity service: http://localhost:4002');
}
bootstrap();
