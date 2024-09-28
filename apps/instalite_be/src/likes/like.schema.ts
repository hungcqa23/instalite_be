import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDocument = Like & Document;
@Schema()
export class Like {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User'
  })
  userId: Types.ObjectId;
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Post'
  })
  postId: Types.ObjectId;

  @Prop({
    required: true,
    default: Date.now
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now
  })
  updatedAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
