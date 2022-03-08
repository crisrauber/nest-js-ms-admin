import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_URL}`,
      ],
      queue: 'admin-backend',
      noAck: false,
    },
  });

  await app.listen();
}
bootstrap();
