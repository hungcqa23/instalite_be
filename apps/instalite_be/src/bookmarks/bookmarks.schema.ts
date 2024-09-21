import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookMarkDocument = BookMark & Document;
@Schema()
export class BookMark {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Post',
    required: true
  })
  post_id: Types.ObjectId;

  @Prop({
    required: true,
    default: Date.now
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now
  })
  updated_at: Date;
}

export const BookMarkSchema = SchemaFactory.createForClass(BookMark);