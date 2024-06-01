import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { FilesService } from 'src/files/files.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Follow, FollowDocument } from 'src/follows/follow.schema';
import { UserMessages } from 'src/constants/messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
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

  public async getUserByUsername(username: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ username }).select('-password');
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  public async addAvatar(userId: string, fileData: Express.Multer.File) {
    const resultUpload = await this.filesService.uploadFile(fileData);
    await this.userModel.findOneAndUpdate({ _id: userId }, { avatar: resultUpload.Location });
    return resultUpload.Location;
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateUserDto
      }
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
          $inc: { follower_count: 1 }
        }
      )
    ]);

    return UserMessages.FOLLOW_SUCCESSFULLY;
  }

  public async unfollow(userId: string, unFollowedUserId: string) {
    const unfollow = await this.followModel.findOne({
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
          $inc: { follower_count: -1 }
        }
      )
    ]);

    return UserMessages.UNFOLLOW_SUCCESSFULLY;
  }
}
