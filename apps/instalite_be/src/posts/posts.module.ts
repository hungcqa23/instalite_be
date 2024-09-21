import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { FilesModule } from '../files/files.module';
import { LikesModule } from '../likes/likes.module';
import { Post, PostSchema } from '../posts/post.schema';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema
      }
    ]),
    FilesModule,
    UsersModule,
    LikesModule,
    BookmarksModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, MongooseModule]
})
export class PostsModule {}
