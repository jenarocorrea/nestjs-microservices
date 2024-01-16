import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SqsModule } from './sqs/sqs-config.module';
import { SqsConsumerService } from './sqs/sqs-consumer.module';
import { SqsPollingService } from './sqs/sqs-polling.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SqsScheduleService } from './sqs/sqs-schedule.service';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    SqsConsumerService,
    SqsPollingService,
    SqsScheduleService,
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    SqsModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
