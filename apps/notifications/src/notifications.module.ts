import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required()
      })
    }),
    ClientsModule.registerAsync([])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
