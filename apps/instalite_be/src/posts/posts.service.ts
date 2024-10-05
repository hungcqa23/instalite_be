import { PostType } from '@app/common/constants/enum';
import { PostMessages } from '@app/common/constants/messages';
import { PageMetaDto } from '@app/common/pagination/page-meta.dto';
import { PageOptionsDto } from '@app/common/pagination/page-options.dto';
import { PageDto } from '@app/common/pagination/page.dto';
import { Model, Types } from 'mongoose';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BookMark, BookMarkDocument } from '../bookmarks/bookmarks.schema';
import { FilesService } from '../files/files.service';
import { Like, LikeDocument } from '../likes/like.schema';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { MediaType } from '../posts/dto/media.interface';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
import { Post, PostDocument } from '../posts/post.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class PostsService {
  constructor(
    private readonly filesService: FilesService,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
    @InjectModel(BookMark.name)
    private readonly bookMarkModel: Model<BookMarkDocument>
  ) {}

  public async create(
    postBody: CreatePostDto & {
      userId: string;
    }
  ): Promise<PostDocument> {
    const { parentPostId, ...body } = postBody;

    if (parentPostId) {
      const data = await this.postModel.findOne({
        _id: parentPostId,
        typePost: PostType.NewPost
      });

      if (!data) throw new HttpException(PostMessages.POST_PARENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const [post] = await Promise.all([
      this.postModel.create({
        ...body,
        parentPostId,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      this.userModel.findOneAndUpdate(
        {
          _id: postBody.userId
        },
        {
          $inc: {
            postsCount: 1
          }
        }
      )
    ]);
    return post;
  }

  public async getPostById(id: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({
        _id: id
      })
      ?.populate({
        path: 'userId',
        select: 'username avatar'
      })
      ?.populate({
        path: 'parentPostId',
        select: 'content createdAt updatedAt userId',
        populate: {
          path: 'userId',
          select: 'username avatar'
        }
      });

    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    return post;
  }

  public async getPostsByUsername(username: string) {
    const user = await this.userModel.findOne({
      username
    });
    const posts = await this.postModel
      .find({
        userId: user._id,
        typePost: PostType.NewPost
      })
      .populate({
        path: 'userId',
        select: 'username avatar'
      })
      .sort({
        createdAt: -1
      });

    return posts;
  }

  public async uploadMedia(id: string, file?: Express.Multer.File) {
    const post = await this.postModel.findOne({
      _id: id
    });

    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (!file) {
      return await this.postModel.findOneAndUpdate(
        {
          _id: id
        },
        {
          $unset: {
            media: true
          }
        },
        {
          new: true
        }
      );
    }

    const result = await this.filesService.uploadFile(file);
    if (file.mimetype === 'video/*') {
      await this.postModel.findOneAndUpdate(
        {
          _id: id
        },
        {
          media: {
            url: result.Location,
            type: MediaType.VIDEO
          }
        }
      );
      return result.Location;
    }

    await this.postModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        media: {
          url: result.Location,
          type: MediaType.IMAGE
        }
      }
    );
    return result.Location;
  }

  public async uploadVideoHLS(file: Express.Multer.File, postId: string) {
    await this.filesService.encodeHLSWithMultipleVideoStreams(file.path);
    await this.postModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        media: {
          url: file.path,
          type: MediaType.VIDEO
        }
      }
    );
    return file.path;
  }

  public async deletePost(id: string, userId: string) {
    const post = await this.postModel.findOneAndDelete({
      _id: id,
      userId: userId
    });
    if (!post) throw new HttpException(PostMessages.POST_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this.userModel.findOneAndUpdate(
        {
          _id: post.userId
        },
        {
          $inc: {
            postsCount: -1
          }
        }
      ),
      this.likeModel.deleteMany({
        postId: id
      }),
      this.bookMarkModel.deleteMany({
        postId: id
      }),
      this.postModel.deleteMany({
        parentPostId: id
      })
    ]);

    return post;
  }

  public async getAllPosts(pageOptionsDto: PageOptionsDto) {
    const posts = await this.postModel
      .find({
        typePost: PostType.NewPost
      })
      .sort({
        createdAt: -1
      })
      .populate({
        path: 'userId',
        select: 'username avatar'
      })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const itemCount = await this.postModel.countDocuments({
      typePost: PostType.NewPost
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(posts, pageMetaDto);
  }

  public async getComments(id: string) {
    const comments = await this.postModel
      .find({
        parentPostId: new Types.ObjectId(id),
        typePost: PostType.Comment
      })
      .populate({
        path: 'userId',
        select: 'username avatar'
      });

    return comments;
  }

  public async updatePost(id: string, post: UpdatePostDto) {
    const postUpdate = await this.postModel.findOneAndUpdate(
      {
        _id: id
      },
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
