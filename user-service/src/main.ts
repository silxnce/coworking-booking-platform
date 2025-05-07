import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RpcExceptionsFilter } from './rpc-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: 'user-service',
        queueOptions: { durable: false },
      },
    },
  );
  app.useGlobalFilters(new RpcExceptionsFilter());
  await app.listen();
}
bootstrap();
