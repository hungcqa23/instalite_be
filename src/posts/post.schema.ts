import mongoose, { Document } from 'mongoose';
import { PostType } from 'src/constants/enum';
import { Media, MediaType } from 'src/posts/dto/media.interface';
import { User } from 'src/users/user.schema';

import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

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
  type_post: PostType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  })
  parent_post_id: Post;

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
  updated_at: Date;

  @Prop({
    required: true,
    default: Date.now
  })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
