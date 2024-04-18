import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  full_name: string;

  @Prop({ default: 0 })
  followers_count: number;

  @Prop({ default: 0 })
  following_count: number;

  @Prop({ default: 0 })
  posts_count: number;

  @Prop()
  bio: string;

  @Prop()
  avatar: string;

  @Prop()
  date_of_birth: Date;

  @Prop()
  refresh_token: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop({ default: false })
  is_registered_via_oauth_google: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
