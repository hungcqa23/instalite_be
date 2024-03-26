import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [UsersModule, PostsModule, LikesModule, BookmarksModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
