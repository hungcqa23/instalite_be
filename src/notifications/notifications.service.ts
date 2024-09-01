import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument
} from 'src/notifications/notification.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>
  ) {}

  public async getNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({
        user_receiver_id: new Types.ObjectId(userId)
      })
      ?.populate({
        path: 'user_receiver_id',
        select: 'username avatar'
      })
      ?.populate({
        path: 'user_id',
        select: 'username avatar'
      });

    return notifications;
  }
}
