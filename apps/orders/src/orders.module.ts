import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SqsModule } from './sqs/sqs-config.module';
import { SqsProducerService } from './sqs/sqs-producer.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, SqsProducerService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SqsModule,
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
