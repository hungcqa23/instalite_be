import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from 'src/likes/like.schema';
import { Post, PostDocument } from 'src/posts/post.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>
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
        user_id: userId,
        post_id: postId
      },
      {
        user_id: userId,
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
    console.log(userId);
    console.log(postId);

    if (await this.isLikedPost(userId, postId))
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: {
          likes: -1
        }
      });

    const result = await this.likeModel.findOneAndDelete({
      user_id: userId,
      post_id: postId
    });

    return result;
  }

  async isLikedPost(userId: string, postId: string) {
    const result = await this.likeModel.findOne({
      user_id: userId,
      post_id: postId
    });
    console.log(result);
    return result ? true : false;
  }
}
