import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow, FollowDocument } from 'src/follows/follow.schema';
import { User, UserDocument } from 'src/users/user.schema';

@Controller('follows')
export class FollowsController {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async follow(userId: string, followingId: string) {
    const follow = await this.followModel.create({
      user_id: userId,
      following_id: followingId
    });

    await Promise.all([
      this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { following_count: 1 }
        }
      ),
      this.userModel.findOneAndUpdate(
        { _id: followingId },
        {
          $inc: { follower_count: 1 }
        }
      )
    ]);
    return follow;
  }
}
