import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostMessages } from 'src/constants/messages';
import { FilesService } from 'src/files/files.service';
import { Post, PostDocument } from 'src/posts/post.schema';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { MediaType } from 'src/posts/dto/media.interface';
import { User, UserDocument } from 'src/users/user.schema';
import { Like, LikeDocument } from 'src/likes/like.schema';
import { BookMark, BookMarkDocument } from 'src/bookmarks/bookmarks.schema';
import { PostType } from 'src/constants/enum';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly filesService: FilesService,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(BookMark.name) private readonly bookMarkModel: Model<BookMarkDocument>
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

  public async getPostsByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    const posts = await this.postModel.find({ user_id: user._id, type_post: PostType.NewPost });

    return posts;
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

  public async uploadVideoHLS(file: Express.Multer.File, postId: string) {
    await this.filesService.encodeHLSWithMultipleVideoStreams(file.path);
    await this.postModel.findOneAndUpdate({ _id: postId }, { media: { url: file.path, type: MediaType.VIDEO } });
    return file.path;
  }

  public async deletePost(id: string, userId: string) {
    const post = await this.postModel.findOneAndDelete({ _id: id, user_id: userId });
    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this.userModel.findOneAndUpdate({ _id: post.user_id }, { $inc: { posts_count: -1 } }),
      this.likeModel.deleteMany({ post_id: id }),
      this.bookMarkModel.deleteMany({ post_id: id }),
      this.postModel.deleteMany({ parent_post_id: id })
    ]);
    return post;
  }

  public async getAllPosts() {
    const posts = await this.postModel
      .find({
        type_post: PostType.NewPost
      })
      .sort({ created_at: -1 })
      .populate({
        path: 'user_id',
        select: 'username avatar'
      });

    return posts;
  }

  public async getComments(id: string) {
    const comments = await this.postModel.find({ parent_post_id: id, type_post: PostType.Comment }).populate({
      path: 'user_id',
      select: 'username avatar'
    });
    return comments;
  }

  public async updatePost(id: string, post: UpdatePostDto) {
    const postUpdate = await this.postModel.findOneAndUpdate(
      { _id: id },
      {
        content: post.content
      },
      {
        new: true
      }
    );
    if (!postUpdate) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    return postUpdate;
  }
}
