import { Model, Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BookMark, BookMarkDocument } from '../bookmarks/bookmarks.schema';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(BookMark.name)
    private readonly bookMarkModel: Model<BookMarkDocument>
  ) {}

  public async bookmarkPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndUpdate(
      {
        userId: userId,
        postId: postId
      },
      {
        userId: userId,
        postId: new Types.ObjectId(postId)
      },
      {
        upsert: true,
        new: true
      }
    );

    return result;
  }

  public async unBookmark(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId)
    });

    return result;
  }

  public async getBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel
      .find({
        userId: userId
      })
      .populate('postId')
      .populate('userId', 'username avatar');

    return result;
  }

  public async isBookmarkedPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOne({
      userId: userId,
      postId: new Types.ObjectId(postId) // postId
    });
    return result ? true : false;
  }

  public async getAllBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel
      .find({
        userId: userId
      })
      .populate('postId')
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username avatar'
        }
      });
    return result;
  }
}
