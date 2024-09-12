import { BookMark, BookMarkSchema } from '~/bookmarks/bookmarks.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService, MongooseModule]
})
export class BookmarksModule {}
