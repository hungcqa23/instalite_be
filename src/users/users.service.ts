import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.create(createUserDto);
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
    const user = await this.userModel.findOne({ _id: userId, refresh_token: refreshToken });
    if (!user) throw new UnauthorizedException();

    return user;
  }

  public async removeRefreshToken(userId: string) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { refresh_token: null });
  }
}
