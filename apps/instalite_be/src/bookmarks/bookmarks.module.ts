import { PostsModule } from 'apps/instalite_be/src/posts/posts.module';
import { UsersModule } from 'apps/instalite_be/src/users/users.module';

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookMark, BookMarkSchema } from '../bookmarks/bookmarks.schema';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BookMark.name,
        schema: BookMarkSchema
      }
    ])
    // UsersModule
    // forwardRef(() => PostsModule)
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService, MongooseModule]
})
export class BookmarksModule {}
