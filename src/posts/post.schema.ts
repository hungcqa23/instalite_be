import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';
import { PostType } from 'src/constants/enum';
import { Media, MediaType } from 'src/posts/dto/media.interface';
import { User } from 'src/users/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  type_post: PostType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
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

  @Prop({ required: true, default: Date.now })
  created_at: Date;

  @Prop({ required: true, default: Date.now })
  updated_at: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
