import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SqsPollingService } from './sqs-polling.service';

@Injectable()
export class SqsScheduleService implements OnModuleInit {
  constructor(private sqsPollingService: SqsPollingService) {}
  onModuleInit() {
    this.startPolling();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  startPolling() {
    this.sqsPollingService.pollForMessages().then(() => {
      console.log('Polling for SQS messages...');
    });
  }
}
