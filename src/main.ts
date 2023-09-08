import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { RequestIdMiddleware } from './shared/middleware/request-id/request-id.middleware';
import responseTime from 'response-time';
import { ResponseTransformInterceptor } from 'src/shared/interceptors/response.interceptor';
import { BodyValidationPipe } from 'src/shared/pipes/body-validation.pipe';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const appPort = config.get('port');
  const appName = config.get('name');
  const appVersion = config.get('version');

  app.setGlobalPrefix(`api/${appVersion}`);

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);

  //allow web browsers to make requests to your NestJS application from other domains. Limit domains can connect to your server with corsOptions
  app.enableCors();
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(new BodyValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  //record response time
  // app.use(
  //   responseTime({
  //     header: 'x-response-time',
  //   }),
  // );

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${appName}`)
    .setDescription(`API`)
    .setVersion(`${appVersion}`)
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/${appVersion}/swagger`, app, document, {
    customSiteTitle: `${appName}`,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(appPort);
  console.log(`Document at: api/${appVersion}/swagger`);
}
bootstrap();
