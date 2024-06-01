import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMessages } from 'src/constants/messages';
import { Follow, FollowDocument } from 'src/follows/follow.schema';
import { UserDocument, User } from 'src/users/user.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  public async createFollow(userId: string, followedUserId: string) {
    const follow = await this.followModel.findOne({
      user_id: userId,
      followed_user_id: followedUserId
    });
    if (follow) return UserMessages.ALREADY_FOLLOWED;

    await this.followModel.create({
      user_id: userId,
      followed_user_id: followedUserId
    });

    await Promise.all([
      this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { following_count: 1 }
        }
      ),
      this.userModel.findOneAndUpdate(
        { _id: followedUserId },
        {
          $inc: { follower_count: 1 }
        }
      )
    ]);

    return UserMessages.FOLLOW_SUCCESSFULLY;
  }

  public async unfollow(userId: string, unFollowedUserId: string) {
    const unfollow = await this.followModel.findOne({
      user_id: userId,
      followed_user_id: unFollowedUserId
    });
    if (!unfollow) return UserMessages.ALREADY_UNFOLLOWED;

    await Promise.all([
      this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { following_count: -1 }
        }
      ),
      this.userModel.findOneAndUpdate(
        { _id: unFollowedUserId },
        {
          $inc: { follower_count: -1 }
        }
      )
    ]);

    return UserMessages.UNFOLLOW_SUCCESSFULLY;
  }
}
