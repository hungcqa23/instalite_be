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
  user_id: Types.ObjectId;
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Post'
  })
  post_id: Types.ObjectId;

  @Prop({
    required: true,
    default: Date.now
  })
  created_at: Date;

  @Prop({
    required: true,
    default: Date.now
  })
  updated_at: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
