import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema()
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  following_id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
