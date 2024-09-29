import { UserMessages } from '@app/common/constants/messages';
import { Response } from 'express';

import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { UnFollowDto } from './dto/un-follow-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(
    @Body()
    createUserDto: CreateUserDto
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  async getAllUsers(
    @Query('username')
    username?: string
  ) {
    const data = await this.usersService.searchUsersByUsername(username);
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Patch('avatar')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar for user',
    type: FileUploadDto
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeValidator({
            fileType: 'image/png|image/jpeg|image/jpg'
          })
        ]
      })
    )
    file: Express.Multer.File,
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.usersService.addAvatar(
      req.user._id.toString(),
      file
    );

    return {
      message: UserMessages.UPLOAD_AVATAR_SUCCESSFULLY,
      data
    };
  }

  @Get('me')
  @UseGuards(JwtAccessTokenGuard)
  async getMe(
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.usersService.getUserById(req.user._id.toString());

    if (!data)
      throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Put('me')
  @UseGuards(JwtAccessTokenGuard)
  async updateMe(
    @Req()
    req: RequestWithUser,
    @Body()
    updateUserDto: UpdateUserDto
  ) {
    const data = await this.usersService.updateUser(
      req.user._id.toString(),
      updateUserDto
    );
    return {
      message: UserMessages.UPDATE_USER_SUCCESSFULLY,
      data
    };
  }

  @Get('recommend')
  @UseGuards(JwtAccessTokenGuard)
  async getRecommendUsers(
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.usersService.getRecommendUsers(
      req.user._id.toString()
    );
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Get(':username/follow')
  async checkFollow(
    @Param('username')
    username: string,
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.usersService.checkFollow(
      req.user._id.toString(),
      username
    );

    return {
      message: UserMessages.CHECK_FOLLOW_SUCCESSFULLY,
      data
    };
  }

  @Get(':username')
  @UseGuards(JwtAccessTokenGuard)
  async getUserByUsername(
    @Param('username')
    username: string,
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.usersService.getUserByUsername(
      username,
      req.user._id.toString()
    );
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Get(':username/followers')
  async getAllFollowers(
    @Param('username')
    username: string
  ) {
    const data = await this.usersService.getAllFollowers(username);

    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Get(':username/followings')
  async getAllFollowings(
    @Param('username')
    username: string
  ) {
    const data = await this.usersService.getAllFollowings(username);

    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      data
    };
  }

  @Post('follow')
  @UseGuards(JwtAccessTokenGuard)
  async follow(
    @Req()
    req: RequestWithUser,
    @Body()
    createFollowDto: CreateFollowDto,
    @Res()
    res: Response
  ) {
    const message = await this.usersService.createFollow(
      req.user._id.toString(),
      createFollowDto.followedUserId
    );

    return res.status(HttpStatus.CREATED).json({
      message
    });
  }

  @Post('unfollow')
  @UseGuards(JwtAccessTokenGuard)
  async unfollow(
    @Req()
    req: RequestWithUser,
    @Body()
    unfollowDto: UnFollowDto,
    @Res()
    res: Response
  ) {
    const result = await this.usersService.unfollow(
      req.user._id.toString(),
      unfollowDto.followedUserId
    );

    return res.status(HttpStatus.OK).json({
      message: result
    });
  }
}
