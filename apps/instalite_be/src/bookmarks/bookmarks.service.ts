import { PostMessages, UserMessages } from '@app/common/constants/messages';
// import { PostsService } from 'apps/instalite_be/src/posts/posts.service';
// import { UsersService } from 'apps/instalite_be/src/users/users.service';
import { Model, Types } from 'mongoose';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BookMark, BookMarkDocument } from '../bookmarks/bookmarks.schema';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(BookMark.name)
    private readonly bookMarkModel: Model<BookMarkDocument>
    // private readonly usersService: UsersService,
    // private readonly postsService: PostsService
  ) {}

  public async bookmarkPost(userId: string, postId: string) {
    // const [user, post] = await Promise.all([
    //   this.usersService.getUserById(userId),
    //   this.postsService.getPostById(postId)
    // ]);

    // if (!user || !post)
    //   throw new HttpException(
    //     `${UserMessages.NOT_FOUND} or ${PostMessages.POST_NOT_FOUND}`,
    //     404
    //   );

    const isBookmarked = await this.isBookmarkedPost(userId, postId);
    if (isBookmarked)
      throw new HttpException('Already bookmarked', HttpStatus.CONFLICT);

    const result = await this.bookMarkModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId)
      },
      {
        userId: new Types.ObjectId(userId),
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
        userId: new Types.ObjectId(userId)
      })
      .populate('postId')
      .populate('userId', 'username avatar');

    return result;
  }

  public async isBookmarkedPost(userId: string, postId: string) {
    const result = await this.bookMarkModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId) // postId
    });

    return result ? true : false;
  }

  public async getAllBookmarkedPosts(userId: string) {
    const result = await this.bookMarkModel
      .find({
        userId: new Types.ObjectId(userId)
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
