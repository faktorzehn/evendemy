import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MeetingsModule } from './meetings/meetings.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './core/image.service';
import { CoreModule } from './core/core.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigTokens } from './config.tokens';
import * as Joi from 'joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { WebConfigModule } from './web-config/web-config.module';

@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        [ConfigTokens.DB_HOST]: Joi.string().required(),
        [ConfigTokens.DB_PORT]: Joi.number().default(5432),
        [ConfigTokens.DB_USERNAME]: Joi.string().required(),
        [ConfigTokens.DB_PASSWORD]: Joi.string().required(),
        [ConfigTokens.DB_DATABASE]: Joi.string().required(),
        [ConfigTokens.USER_IMAGE_FOLDER]: Joi.string().default("/usr/src/user_images"),
        [ConfigTokens.MEETING_IMAGE_FOLDER]: Joi.string().default("/usr/src/meeting_images"),
        [ConfigTokens.MAIL_ENABLED]: Joi.boolean().required(),
        [ConfigTokens.MAIL_ADDRESS]: Joi.string(),
        [ConfigTokens.MAIL_HOST]: Joi.string(),
        [ConfigTokens.MAIL_PASSWORD]: Joi.string(),
        [ConfigTokens.MAIL_PORT]: Joi.number(),
        [ConfigTokens.MAIL_USERNAME]: Joi.string(),
        [ConfigTokens.CALENDAR_COMPANY]: Joi.string().required(),
        [ConfigTokens.CALENDAR_ORGANIZER_MAIL]: Joi.string().required(),
        [ConfigTokens.CALENDAR_ORGANIZER_NAME]: Joi.string().required(),
        [ConfigTokens.CALENDAR_TIMEZONE]: Joi.string().required(),
        [ConfigTokens.KC_SECRET]: Joi.string().required(), 
        [ConfigTokens.KC_URL]: Joi.string().required(),
        [ConfigTokens.KC_CLIENT_ID]: Joi.string().required(),
        [ConfigTokens.KC_REALM]: Joi.string().required(),
        [ConfigTokens.WEBAPP_KC_URL]: Joi.string().required(),
        [ConfigTokens.WEBAPP_KC_CLIENT_ID]: Joi.string().required(),
        [ConfigTokens.WEBAPP_KC_REALM]: Joi.string().required()
      }),
    }),    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ConfigTokens.DB_HOST),
        port: +configService.get(ConfigTokens.DB_PORT),
        username: configService.get(ConfigTokens.DB_USERNAME),
        password: configService.get(ConfigTokens.DB_PASSWORD),
        database: configService.get(ConfigTokens.DB_DATABASE),
        synchronize: true,
        autoLoadEntities: true,
      })
    }),
    CoreModule,
    MeetingsModule, 
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,"../../webapp"),
      exclude: ["api/*"],
    }),
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => {
      console.log(`Enabling keycloak ${configService.get(ConfigTokens.KC_URL)}`);
      return {
        authServerUrl: configService.get(ConfigTokens.KC_URL),
        realm: configService.get(ConfigTokens.KC_REALM),
        clientId: configService.get(ConfigTokens.KC_CLIENT_ID),
        secret: configService.get(ConfigTokens.KC_SECRET)
      }
    },
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    WebConfigModule
  ],
  providers: [
    ImageService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    }
  ]
})
export class AppModule {

}
