import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
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
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { LogInDto } from 'src/auth/dtos/log-in.dto';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard';
import { LocalAuthenticationGuard } from 'src/auth/local-authentication.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { UserMessages } from 'src/constants/messages';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const token = await this.authService.signUp(createUserDto);
    // await this.emailService.sendWelcomeEmail(createUserDto.email, 'Welcome', 'Welcome to Instalite!');

    this.authService.sendTokenViaCookie(res, token);

    res.send({
      message: UserMessages.REGISTER_SUCCESSFULLY
    });
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LogInDto })
  async logIn(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const token = await this.authService.signRefreshAndAccessTokens(user._id, user.username);

    this.authService.sendTokenViaCookie(res, token);
    user.password = undefined;
    res.send({ message: UserMessages.LOGIN_SUCCESSFULLY, data: user });
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiCookieAuth('access_token')
  @ApiSecurity('access-token')
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.usersService.removeRefreshToken(req.user._id);

    res.cookie('refresh_token', null, {
      httpOnly: true
    });
    res.cookie('access_token', null, {
      httpOnly: true
    });

    res.send({ message: UserMessages.LOGOUT_SUCCESSFULLY });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const token = await this.authService.signRefreshAndAccessTokens(user._id, user.username);
    this.authService.sendTokenViaCookie(res, token);
    res.send({ message: UserMessages.REFRESH_TOKEN_SUCCESSFULLY });
  }
}
