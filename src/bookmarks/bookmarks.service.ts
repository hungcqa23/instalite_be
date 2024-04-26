import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookMarkDocument } from 'src/bookmarks/bookmarks.schema';

@Injectable()
export class BookmarksService {
  constructor(@InjectModel('BookMark') private readonly BookMarkModel: Model<BookMarkDocument>) {}
}
