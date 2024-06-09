import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/posts/post.schema';
import { PostsService } from './posts.service';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
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
