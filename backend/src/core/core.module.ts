import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { IdService } from './id.service';

/**
 * Core module is global - so you don't have to import it somewhere else.
 */
@Global()
@Module({
    providers: [ ImageService, IdService],
    exports: [ ImageService, IdService]
})
export class CoreModule {}
