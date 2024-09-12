import { Model } from 'mongoose';
import { Like, LikeDocument } from '~/likes/like.schema';
import { Post, PostDocument } from '~/posts/post.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>
  ) {}
  async likePost(userId: string, postId: string) {
    if (!(await this.isLikedPost(userId, postId))) {
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: {
          likes: 1
        }
      });
    }

    const result = await this.likeModel.findOneAndUpdate(
      {
        userId: userId,
        post_id: postId
      },
      {
        userId: userId,
        post_id: postId
      },
      {
        upsert: true,
        new: true
      }
    );

    return result;
  }

  async unlikePost(userId: string, postId: string) {
    if (await this.isLikedPost(userId, postId))
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: {
          likes: -1
        }
      });

    const result = await this.likeModel.findOneAndDelete({
      userId: userId,
      post_id: postId
    });

    return result;
  }

  async isLikedPost(userId: string, postId: string) {
    const result = await this.likeModel.findOne({
      userId: userId,
      post_id: postId
    });
    return result ? true : false;
  }
}
