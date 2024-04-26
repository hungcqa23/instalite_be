import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeDocument } from 'src/likes/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel('Like') private readonly likeModel: Model<LikeDocument>) {}
  async likePost(userId: string, postId: string) {
    const result = await this.likeModel.findOneAndUpdate(
      {
        user_id: userId,
        post_id: postId
      },
      {
        user_id: userId,
        post_id: postId
      },
      {
        upsert: true
      }
    );

    return result;
  }

  async unlikePost(userId: string, postId: string) {
    return await this.likeModel.findOneAndDelete({
      user_id: userId,
      post_id: postId
    });
  }
}
