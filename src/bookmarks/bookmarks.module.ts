import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookMark, BookMarkSchema } from 'src/bookmarks/bookmarks.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BookMark.name, schema: BookMarkSchema }])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService, MongooseModule]
})
export class BookmarksModule {}
