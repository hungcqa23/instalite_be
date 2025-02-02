import { UserMessages } from '@app/common/constants/messages';
import { Cache } from 'cache-manager';
import { Response } from 'express';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { LogInDto } from '../auth/dtos/log-in.dto';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { JwtRefreshGuard } from '../auth/jwt-refresh.guard';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateUserDto
  })
  async signUp(
    @Body()
    createUserDto: CreateUserDto,
    @Res()
    res: Response
  ) {
    const { token, newUser } = await this.authService.signUp(createUserDto);
    // await this.emailService.sendWelcomeEmail(createUserDto.email, 'Welcome', 'Welcome to Instalite!');

    this.authService.sendTokenViaCookie(res, token);

    res.send({
      message: UserMessages.REGISTER_SUCCESSFULLY,
      data: newUser
    });
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LogInDto
  })
  async logIn(
    @Req()
    req: RequestWithUser,
    @Res()
    res: Response
  ) {
    const { user } = req;
    const token = await this.authService.signRefreshAndAccessTokens(
      user._id.toString(),
      user.username
    );

    this.authService.sendTokenViaCookie(res, token);
    user.password = undefined;
    user.refreshToken = undefined;
    res.send({
      message: UserMessages.LOGIN_SUCCESSFULLY,
      data: user
    });
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiCookieAuth('access_token')
  @ApiSecurity('access-token')
  async logOut(
    @Req()
    req: RequestWithUser,
    @Res()
    res: Response
  ) {
    await this.usersService.removeRefreshToken(req.user._id.toString());
    res.cookie('refresh_token', null, {
      httpOnly: true
    });
    res.cookie('access_token', null, {
      httpOnly: true
    });

    res.send({
      message: UserMessages.LOGOUT_SUCCESSFULLY
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(
    @Req()
    req: RequestWithUser,
    @Res()
    res: Response
  ) {
    const { user } = req;
    const token = await this.authService.signRefreshAndAccessTokens(
      user._id.toString(),
      user.username
    );
    this.authService.sendTokenViaCookie(res, token);
    res.send({
      message: UserMessages.REFRESH_TOKEN_SUCCESSFULLY
    });
  }
}
