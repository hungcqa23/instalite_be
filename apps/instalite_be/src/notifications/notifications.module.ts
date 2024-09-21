import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Notification,
  NotificationSchema
} from '../notifications/notification.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema
      }
    ])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MongooseModule],
  exports: [NotificationsService, MongooseModule]
})
export class NotificationsModule {}
