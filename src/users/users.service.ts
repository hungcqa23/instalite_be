import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly filesService: FilesService
  ) {}

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
    console.log(refreshToken, userId);
    const user = await this.userModel.findOne({ _id: userId, refresh_token: refreshToken });
    if (!user) throw new UnauthorizedException();

    return user;
  }

  public async removeRefreshToken(userId: string) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { refresh_token: null });
  }

  public async getUserById(id: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ _id: id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  public async addAvatar(userId: string, fileData: Express.Multer.File) {
    const resultUpload = await this.filesService.uploadFile(fileData);
    await this.userModel.findOneAndUpdate({ _id: userId }, { avatar: resultUpload.Location });
    return resultUpload.Location;
  }
}
