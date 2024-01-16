import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsPollingService {
  constructor(
    @Inject('SQS') private sqs: SQS,
    private configService: ConfigService,
  ) {}

  async pollForMessages(): Promise<void> {
    const queueUrl = this.configService.getOrThrow('SQS_QUEUE_URL');

    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    };

    try {
      const data = await this.sqs.receiveMessage(params).promise();
      if (data.Messages && data.Messages.length > 0) {
        const message = data.Messages[0];
        const { orderId, user, details } = JSON.parse(message.Body);

        // Procesar el mensaje
        console.log(
          `${user}, your order has been placed: #${orderId} ${details}`,
        );

        // Eliminar mensaje de la cola una vez procesado
        await this.sqs
          .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();
      }
    } catch (error) {
      console.error('Error al recibir mensajes de SQS:', error);
    }
  }
}
