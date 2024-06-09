import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from 'src/likes/like.schema';
import { LikesController } from './likes.controller';
import { Post, PostSchema } from 'src/posts/post.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
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
