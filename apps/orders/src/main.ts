import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.setGlobalPrefix('api');

  await app.listen(3002, () =>
    console.log(`REST server listening on port 3002`),
  );

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3003,
      },
    });
  await microservice.listen();
  console.log(`TCP microservice listening on port 3003`);
}
bootstrap();
