import { Module } from '@nestjs/common';
import { WebConfigController as WebConfigController } from './web-config/web-config.controller';

@Module({
  controllers: [WebConfigController]
})
export class WebConfigModule {}
