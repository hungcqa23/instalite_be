import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookMark, BookMarkDocument } from 'src/bookmarks/bookmarks.schema';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(BookMark.name)
    private readonly bookMarkModel: Model<BookMarkDocument>
  ) {}

  public async bookmarkPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndUpdate(
      {
        user_id: userId,
        post_id: postId
      },
      {
        user_id: userId,
        post_id: new Types.ObjectId(postId)
      },
      { upsert: true, new: true }
    );

    return result;
  }

  public async unBookmark(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndDelete({
      user_id: new Types.ObjectId(userId),
      post_id: new Types.ObjectId(postId)
    });

    return result;
  }

  public async getBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel
      .find({ user_id: userId })
      .populate('post_id')
      .populate('user_id', 'username avatar');

    return result;
  }

  public async isBookmarkedPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOne({
      user_id: userId,
      post_id: new Types.ObjectId(postId) // postId
    });
    return result ? true : false;
  }

  public async getAllBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel
      .find({ user_id: userId })
      .populate('post_id')
      .populate({
        path: 'post_id',
        populate: {
          path: 'user_id',
          select: 'username avatar'
        }
      });
    return result;
  }
}
