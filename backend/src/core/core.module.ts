import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { IdService } from './id.service';

@Global()
@Module({
    providers: [ ImageService, IdService, AuthMiddleware],
    exports: [ ImageService, IdService, AuthMiddleware]
})
export class CoreModule {}
