import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cache } from 'cache-manager';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { FilesService } from 'src/files/files.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserMessages } from 'src/constants/messages';
import { Follow, FollowDocument } from 'src/users/follow.schema';
import { NotificationDocument, Notification } from 'src/notifications/notification.schema';
import { NotificationType } from 'src/constants/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    return this.userModel.findOne({ email });
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  public async signUpWithGoogle(email: string, name: string): Promise<UserDocument> {
    const user = await this.userModel.create({
      email,
      name,
      created_at: new Date(),
      updated_at: new Date(),
      is_registered_via_oauth_google: true
    });
    return user;
  }

  public async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { refresh_token: refreshToken });
  }

  public async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    console.log(refreshToken, userId);
    const user = await this.userModel.findOne({ _id: userId, refresh_token: refreshToken });
    if (!user) throw new UnauthorizedException();

    return user;
  }

  public async removeRefreshToken(userId: string) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { refresh_token: null });
  }

  public async getUserById(id: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ _id: id }).select('-password');
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  public async getUserByUsername(username: string, userId: string) {
    const user = await this.userModel.findOne({ username }).select('-password -refresh_token');
    const is_following = await this.followModel.findOne({
      user_id: userId,
      followed_user_id: user._id.toString()
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return {
      user,
      is_following: is_following ? true : false
    };
  }

  public async searchUsersByUsername(username?: string): Promise<UserDocument[]> {
    // I want to search users array by username
    if (!username) return [];
    // i for case insensitive
    const regex = new RegExp(username, 'i');
    const users = await this.userModel
      .find({
        username: { $regex: regex }
      })
      .select('-password -refresh_token');

    return users;
  }

  public async addAvatar(userId: string, fileData: Express.Multer.File) {
    const resultUpload = await this.filesService.uploadFile(fileData);
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { avatar: resultUpload.Location },
      { new: true }
    );
    return user;
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateUserDto,
        username: updateUserDto?.username?.toLowerCase(),
        full_name: updateUserDto?.fullName,
        updated_at: new Date()
      },
      { new: true }
    );
    return user;
  }

  public async createFollow(userId: string, followedUserId: string) {
    const follow = await this.followModel.findOne({
      user_id: userId,
      followed_user_id: followedUserId
    });
    if (follow) return UserMessages.ALREADY_FOLLOWED;

    await this.followModel.create({
      user_id: userId,
      followed_user_id: followedUserId
    });

    await Promise.all([
      this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { following_count: 1 }
        }
      ),
      this.userModel.findOneAndUpdate(
        { _id: followedUserId },
        {
          $inc: { followers_count: 1 }
        }
      ),
      this.notificationModel.create({
        user_id: userId,
        user_receiver_id: new Types.ObjectId(followedUserId),
        type: NotificationType.Follow,
        content: UserMessages.FOLLOW_SUCCESSFULLY
      })
    ]);

    return UserMessages.FOLLOW_SUCCESSFULLY;
  }

  public async unfollow(userId: string, unFollowedUserId: string) {
    const unfollow = await this.followModel.findOneAndDelete({
      user_id: userId,
      followed_user_id: unFollowedUserId
    });
    if (!unfollow) return UserMessages.ALREADY_UNFOLLOWED;

    await Promise.all([
      this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { following_count: -1 }
        }
      ),
      this.userModel.findOneAndUpdate(
        { _id: unFollowedUserId },
        {
          $inc: { followers_count: -1 }
        }
      )
    ]);

    return UserMessages.UNFOLLOW_SUCCESSFULLY;
  }

  public async getRecommendUsers(userId: string) {
    // Find list of user who I'm currently following
    const following = await this.followModel.find({
      user_id: userId
    });
    const followingIds = [following.map(follow => follow.followed_user_id), userId];
    // Exclude the user who I'm currently following
    const users = await this.userModel
      .find({
        _id: { $nin: followingIds }
      })
      .select('-password')
      .limit(4);

    return users;
  }
}
