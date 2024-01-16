import { Module } from '@nestjs/common';
import {
  KeycloakConnectModule,
  //   ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.getOrThrow('KEYCLOAK_AUTH_SERVER_URL'),
        realm: configService.getOrThrow('KEYCLOAK_REALM'),
        clientId: configService.getOrThrow('KEYCLOAK_CLIENT_ID'),
        secret: configService.getOrThrow('KEYCLOAK_CLIENT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AuthModule {}
