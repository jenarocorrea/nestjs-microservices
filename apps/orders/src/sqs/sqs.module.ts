import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';

@Global()
@Module({
  providers: [
    {
      provide: 'SQS',
      useFactory: (configService: ConfigService) => {
        return new SQS({
          region: configService.getOrThrow('AWS_REGION'),
          accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SQS'],
})
export class SqsModule {}
