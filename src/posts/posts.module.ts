import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/posts/post.schema';
import { PostsService } from './posts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
