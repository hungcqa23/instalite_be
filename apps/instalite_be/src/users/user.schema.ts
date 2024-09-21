import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({
    required: true,
    unique: true
  })
  username: string;

  @Prop({
    required: true
  })
  password: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop()
  fullName: string;

  @Prop({
    default: 0
  })
  followersCount: number;

  @Prop({
    default: 0
  })
  followingCount: number;

  @Prop({
    default: 0
  })
  postsCount: number;

  @Prop()
  bio: string;

  @Prop()
  avatar: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({
    default: false
  })
  isRegisteredViaOauthGoogle: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  {
    username: 'text'
  },
  {
    default_language: 'none'
  }
);

export { UserSchema };
