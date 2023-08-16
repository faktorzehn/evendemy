import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    KeycloakConnectModule.register({
      authServerUrl: 'https://ssotest.faktorzehn.de/realms/f10-sso-test',
      clientId: 'evendemy-local',
      secret: 'VXJY3pddqEVVmmDRyCysCG5dwuk6q5gb',
      // Secret key of the client taken from keycloak server
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
  ]
})
export class AuthModule {}
