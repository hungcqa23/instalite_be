import { Model, Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Notification, NotificationDocument } from '../notifications/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>
  ) {}

  public async getNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({
        userReceiverId: new Types.ObjectId(userId)
      })
      ?.populate({
        path: 'userReceiverId',
        select: 'username avatar'
      })
      ?.populate({
        path: 'userId',
        select: 'username avatar'
      });

    return notifications;
  }
}
