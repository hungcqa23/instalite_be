import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostMessages } from 'src/constants/messages';
import { FilesService } from 'src/files/files.service';
import { PostDocument } from 'src/posts/post.schema';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { MediaType } from 'src/posts/dto/media.interface';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostDocument>,
    private readonly filesService: FilesService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  public async create(postBody: CreatePostDto & { user_id: string }): Promise<PostDocument> {
    const [post] = await Promise.all([
      this.postModel.create({
        ...postBody,
        type_post: postBody.typePost,
        parent_post_id: postBody?.parentPostId,
        created_at: new Date(),
        updated_at: new Date()
      }),
      this.userModel.findOneAndUpdate({ _id: postBody.user_id }, { $inc: { posts_count: 1 } })
    ]);
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

  public async uploadMedia(file: Express.Multer.File, id: string) {
    const result = await this.filesService.uploadFile(file);
    if (file.mimetype === 'video/*') {
      await this.postModel.findOneAndUpdate({ _id: id }, { media: { url: result.Location, type: MediaType.VIDEO } });

      return result.Location;
    }

    await this.postModel.findOneAndUpdate({ _id: id }, { media: { url: result.Location, type: MediaType.IMAGE } });
    return result.Location;
  }

  public async uploadVideoHLS(file: Express.Multer.File) {
    await this.filesService.encodeHLSWithMultipleVideoStreams(file.path);
  }

  public async deletePost(id: string, userId: string) {
    const post = await this.postModel.findOneAndDelete({ _id: id, user_id: userId });
    console.log(post);
    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([this.userModel.findOneAndUpdate({ _id: post.user_id }, { $inc: { posts_count: -1 } })]);
    return post;
  }
}
