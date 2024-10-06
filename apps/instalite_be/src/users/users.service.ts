import { NotificationType } from '@app/common/constants/enum';
import { UserMessages } from '@app/common/constants/messages';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { FilesService } from '../files/files.service';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follow, FollowDocument } from './follow.schema';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private readonly SERVICE_NAME = UsersService.name;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly filesService: FilesService
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.create(createUserDto);
    const userId = user._id.toString();
    const userJSON = JSON.stringify(user);
    await this.cacheManager.set(userId, userJSON);

    return user;
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({
      email
    });
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email
    });
  }

  public async signUpWithGoogle(email: string, name: string): Promise<UserDocument> {
    const user = await this.userModel.create({
      email,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRegisteredViaOauthGoogle: true
    });
    return user;
  }

  public async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId)
      },
      {
        refreshToken
      }
    );
  }

  public async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
      refreshToken
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }

  public async removeRefreshToken(userId: string) {
    await this.userModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        refreshToken: null
      }
    );
  }

  public async getUserById(id: string): Promise<UserDocument> {
    const user = this.userModel
      .findOne({
        _id: new Types.ObjectId(id)
      })
      .select('-password');

    if (!user) throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    return user;
  }

  public async getUserByUsername(username: string) {
    const data = await this.cacheManager.get('profile:' + username);
    if (data) return data;

    const user = await this.userModel
      .findOne({
        username
      })
      .select('-password -refreshToken');

    if (!user) throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND);

    await this.cacheManager.set('profile:' + username, user);

    return user;
  }

  public async searchUsersByUsername(username?: string): Promise<UserDocument[]> {
    // I want to search users array by username
    if (!username) return [];
    // i for case insensitive
    const regex = new RegExp(username, 'i');
    const users = await this.userModel
      .find({
        username: {
          $regex: regex
        }
      })
      .select('-password -refresh_token');

    return users;
  }

  public async addAvatar(userId: string, fileData: Express.Multer.File) {
    const resultUpload = await this.filesService.uploadFile(fileData);
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        avatar: resultUpload.Location
      },
      {
        new: true
      }
    );
    return user;
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        ...updateUserDto,
        username: updateUserDto?.username?.toLowerCase(),
        fullName: updateUserDto?.fullName,
        updatedAt: new Date()
      },
      {
        new: true
      }
    );
    await this.cacheManager.del(`profile:${user.username}`);
    console.log('Delete profile successfully!');
    return user;
  }

  public async createFollow(userId: string, followedUserId: string) {
    const follow = await this.followModel.findOne({
      userId: new Types.ObjectId(userId),
      followedUserId: new Types.ObjectId(followedUserId)
    });
    if (follow) return UserMessages.ALREADY_FOLLOWED;

    await this.followModel.create({
      userId: new Types.ObjectId(userId),
      followedUserId: new Types.ObjectId(followedUserId)
    });

    await Promise.all([
      this.userModel.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $inc: {
            followingCount: 1
          }
        }
      ),
      this.userModel.findOneAndUpdate(
        {
          _id: followedUserId
        },
        {
          $inc: {
            followersCount: 1
          }
        }
      ),
      this.notificationModel.create({
        userId,
        userReceiverId: new Types.ObjectId(followedUserId),
        type: NotificationType.Follow,
        content: UserMessages.FOLLOW_SUCCESSFULLY
      })
    ]);

    return UserMessages.FOLLOW_SUCCESSFULLY;
  }

  public async unfollow(userId: string, unFollowedUserId: string) {
    const unfollow = await this.followModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      followedUserId: new Types.ObjectId(unFollowedUserId)
    });
    if (!unfollow) return UserMessages.ALREADY_UNFOLLOWED;

    await Promise.all([
      this.userModel.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $inc: {
            followingCount: -1
          }
        }
      ),
      this.userModel.findOneAndUpdate(
        {
          _id: unFollowedUserId
        },
        {
          $inc: {
            followersCount: -1
          }
        }
      )
    ]);

    return UserMessages.UNFOLLOW_SUCCESSFULLY;
  }

  public async getRecommendUsers(userId: string) {
    // Find list of user who I'm currently following
    const following = await this.followModel.find({
      userId: userId
    });

    const followingIds = [
      ...following.map(follow => new Types.ObjectId(follow.followedUserId)),
      new Types.ObjectId(userId)
    ];

    // Exclude the user who I'm currently following
    const users = await this.userModel
      .find({
        _id: {
          $nin: followingIds
        }
      })
      .select('-password')
      .limit(4);

    return users;
  }

  public async getAllFollowers(username: string) {
    const userId = await this.userModel.findOne({
      username
    });
    const followers = await this.followModel
      .find({
        followedUserId: userId._id
      })
      .populate('followedUserId', 'username avatar fullName');

    return followers;
  }

  public async getAllFollowings(username: string) {
    const userId = await this.userModel.findOne({
      username
    });
    const followings = await this.followModel
      .find({
        userId: userId._id
      })
      .populate('followedUserId', 'username avatar fullName');

    return followings;
  }

  public async checkFollow(userId: string, followedUsername: string) {
    const followedUser = await this.userModel.findOne({
      username: followedUsername
    });
    if (!followedUser) return false;

    const follow = await this.followModel.findOne({
      userId: new Types.ObjectId(userId),
      followedUserId: followedUser._id
    });
    if (follow) return true;
    return false;
  }
}
