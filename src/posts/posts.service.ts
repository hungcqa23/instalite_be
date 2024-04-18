import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostMessages } from 'src/constants/messages';
import { PostDocument } from 'src/posts/post.schema';
import { CreatePostDto } from 'src/posts/type/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<PostDocument>) {}

  public async create(postBody: CreatePostDto & { user_id: string }): Promise<PostDocument> {
    const post = await this.postModel.create({
      ...postBody,
      type_post: postBody.typePost,
      parent_post_id: postBody?.parentPostId,
      created_at: new Date(),
      updated_at: new Date()
    });
    return post;
  }

  public async getPostById(id: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: id })
      ?.populate({
        path: 'user_id',
        select: 'username avatar'
      })
      ?.populate({
        path: 'parent_post_id',
        select: 'content created_at updated_at user_id',
        populate: {
          path: 'user_id',
          select: 'username avatar'
        }
      });

    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    return post;
  }
}
