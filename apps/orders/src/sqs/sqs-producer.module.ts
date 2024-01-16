import { Injectable, Inject } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsProducerService {
  private queueUrl: string;

  constructor(
    @Inject('SQS') private sqs: SQS,
    private configService: ConfigService,
  ) {
    this.queueUrl = this.configService.getOrThrow('SQS_QUEUE_URL');
  }

  async sendMessage(messageBody: any): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };

    try {
      await this.sqs.sendMessage(params).promise();
      console.log('Mensaje enviado a SQS con éxito');
    } catch (error) {
      console.error('Error al enviar mensaje a SQS:', error);
    }
  }
}
