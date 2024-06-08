import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from 'src/constants/enum';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  content: string;

  @Prop({ required: true, type: Number })
  type: NotificationType;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_receiver_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post_id: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
