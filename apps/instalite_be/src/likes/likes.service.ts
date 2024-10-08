import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Like, LikeDocument } from '../likes/like.schema';
import { Post, PostDocument } from '../posts/post.schema';

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
        userId,
        postId
      },
      {
        userId,
        postId
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
      userId,
      postId
    });

    return result;
  }

  async isLikedPost(userId: string, postId: string) {
    const result = await this.likeModel.findOne({
      userId,
      postId
    });
    return result ? true : false;
  }
}
