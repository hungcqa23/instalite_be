import { AllExceptionsFilter } from '@app/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));

  // NOTE: Interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  const configService = app.get(ConfigService);

  // NOTE: Add Security
  app.use(helmet());

  // NOTE: Add Cookies Parser
  app.use(cookieParser());

  // NOTE: Add Cors
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Instalite')
    .setDescription('The Instalite API description')
    .setVersion('1.0')
    .addCookieAuth()
    .addTag('User')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const PORT = configService.get('PORT') || 8000;
  await app.listen(PORT);
}

bootstrap();
