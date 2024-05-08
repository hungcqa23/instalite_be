import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from 'src/config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger()
  });

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
  app.enableCors();

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
