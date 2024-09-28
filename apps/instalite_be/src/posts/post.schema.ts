import { PostType } from '@app/common/constants/enum';
import mongoose, { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

import { Media, MediaType } from '../posts/dto/media.interface';
import { User } from '../users/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  userId: User;

  @Prop({
    required: true
  })
  content: string;

  @Prop({
    required: true
  })
  typePost: PostType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  })
  parentPostId: Post;

  @Prop(
    raw({
      type: {
        enum: MediaType,
        type: Number
      },
      url: String
    })
  )
  media: Media;

  @Prop({
    required: true,
    default: 0
  })
  likes: number;

  @Prop({
    required: true,
    default: 0
  })
  comments: number;

  @Prop({
    required: true,
    default: Date.now
  })
  updatedAt: Date;

  @Prop({
    required: true,
    default: Date.now
  })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
