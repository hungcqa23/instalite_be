import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { FilesModule } from 'src/files/files.module';
import { LikesModule } from 'src/likes/likes.module';
import { Post, PostSchema } from 'src/posts/post.schema';
import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
