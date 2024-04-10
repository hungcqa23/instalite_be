import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Instalite')
    .setDescription('API for Front End Instalite')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const PORT = configService.get('PORT') ?? 3000;
  await app.listen(PORT);
}
bootstrap();
