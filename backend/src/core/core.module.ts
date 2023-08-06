import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { IdService } from './id.service';

/**
 * Core module is global - so you don't have to import it somewhere else.
 */
@Global()
@Module({
    providers: [ ImageService, IdService, AuthMiddleware],
    exports: [ ImageService, IdService, AuthMiddleware]
})
export class CoreModule {}
