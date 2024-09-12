import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FollowDocument = Follow & Document;

@Schema()
export class Follow {
  @Prop({
    type: Types.ObjectId,
    ref: 'User'
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User'
  })
  followedUserId: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now
  })
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
