import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { UserMessages } from 'src/constants/messages';
import { UsersService } from 'src/users/users.service';

@Controller('users')
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
  @UseInterceptors(FileInterceptor('file'))
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
}
