import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotFoundInterceptor } from './not-found.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger-docs
  const config = new DocumentBuilder()
    .setTitle('Evendemy')
    .setDescription('The API for evendemy')
    .setVersion('3.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new NotFoundInterceptor());

  await app.listen(3000);
}
bootstrap();
