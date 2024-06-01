import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { UserMessages } from 'src/constants/messages';
import { CreateFollowDto } from 'src/users/dto/create-follow.dto';
import { FileUploadDto } from 'src/users/dto/file-upload.dto';
import { UnFollowDto } from 'src/users/dto/un-follow-dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Get()
  // signIn(@Body() logInDto: LogInDto) {
  //   return this.usersService.findOne(logInDto.username);
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('avatar')
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
        validators: [new FileTypeValidator({ fileType: 'image/png|image/jpeg|image/jpg' })]
      })
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    const url_avatar = await this.usersService.addAvatar(req.user._id, file);

    return {
      message: UserMessages.UPLOAD_AVATAR_SUCCESSFULLY,
      url_avatar
    };
  }

  @Get('me')
  @UseGuards(JwtAccessTokenGuard)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.usersService.getUserById(req.user._id);
    if (!user) throw new HttpException(UserMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      user
    };
  }

  @Get(':username')
  @UseGuards(JwtAccessTokenGuard)
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByUsername(username);
    return {
      message: UserMessages.GET_USER_SUCCESSFULLY,
      user
    };
  }

  @Post('follow')
  @UseGuards(JwtAccessTokenGuard)
  async follow(@Req() req: RequestWithUser, @Body() createFollowDto: CreateFollowDto, @Res() res: Response) {
    const result = await this.usersService.createFollow(req.user._id, createFollowDto.followedUserId);

    return res.status(HttpStatus.CREATED).json({
      message: result
    });
  }

  @Delete('follow')
  @UseGuards(JwtAccessTokenGuard)
  async unfollow(@Req() req: RequestWithUser, @Body() unfollowDto: UnFollowDto, @Res() res: Response) {
    const result = await this.usersService.unfollow(req.user._id, unfollowDto.followedUserId);

    return res.status(204).json({
      message: result
    });
  }
}
