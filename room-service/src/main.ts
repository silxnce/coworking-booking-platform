import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pack = require('./../package.json');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: pack.name,
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
}
bootstrap();
