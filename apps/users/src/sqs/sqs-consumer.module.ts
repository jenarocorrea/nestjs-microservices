import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsConsumerService {
  private queueUrl: string;

  constructor(
    @Inject('SQS') private sqs: SQS,
    private configService: ConfigService, // Asegúrate de inyectar ConfigService
  ) {
    this.queueUrl = this.configService.getOrThrow('SQS_QUEUE_URL');
  }

  async receiveAndDeleteMessage() {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
    };

    try {
      const data = await this.sqs.receiveMessage(params).promise();

      if (data.Messages && data.Messages.length > 0) {
        const message = data.Messages[0];

        console.log('Mensaje recibido:', message.Body);

        // Procesa el mensaje aquí
        // ...

        // Eliminar mensaje de la cola
        await this.sqs
          .deleteMessage({
            QueueUrl: this.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();

        console.log('Mensaje eliminado de la cola');
      }
    } catch (error) {
      console.error('Error al recibir o eliminar mensajes:', error);
    }
  }
}
