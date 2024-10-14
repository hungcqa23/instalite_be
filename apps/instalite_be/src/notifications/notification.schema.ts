import { NotificationType } from '@app/common/constants/enums';
import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  content: string;

  @Prop({
    required: true,
    type: Number
  })
  type: NotificationType;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User'
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User'
  })
  userReceiverId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Post'
  })
  postId: Types.ObjectId;

  @Prop({
    default: false
  })
  checked: boolean;

  @Prop({
    default: Date.now
  })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
