import { Like, LikeSchema } from '~/likes/like.schema';
import { Post, PostSchema } from '~/posts/post.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema
      },
      {
        name: Post.name,
        schema: PostSchema
      }
    ])
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService, MongooseModule]
})
export class LikesModule {}
