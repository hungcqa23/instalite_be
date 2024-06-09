import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookMark, BookMarkDocument } from 'src/bookmarks/bookmarks.schema';

@Injectable()
export class BookmarksService {
  constructor(@InjectModel(BookMark.name) private readonly bookMarkModel: Model<BookMarkDocument>) {}

  public async bookmarkPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndUpdate(
      {
        user_id: userId,
        post_id: postId
      },
      {
        user_id: userId,
        post_id: postId
      },
      { upsert: true, new: true }
    );

    return result;
  }

  public async unBookmark(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndDelete({
      user_id: userId,
      post_id: postId
    });

    return result;
  }

  public async getBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel.find({ user_id: userId }).populate('post_id user_id');

    return result;
  }

  public async isBookmarkedPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOne({
      user_id: userId,
      post_id: postId
    });

    return result ? true : false;
  }
}
