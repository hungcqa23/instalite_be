import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard';
import { LocalAuthenticationGuard } from 'src/auth/local-authentication.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { UserMessages } from 'src/constants/messages';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const token = await this.authService.signUp(createUserDto);
    await this.emailService.sendWelcomeEmail(createUserDto.email, 'Welcome', 'Welcome to Instalite!');

    this.authService.sendTokenViaCookie(res, token);

    res.send({
      message: UserMessages.REGISTER_SUCCESSFULLY
    });
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const token = await this.authService.signRefreshAndAccessTokens(user._id, user.username);

    this.authService.sendTokenViaCookie(res, token);

    res.send({ message: UserMessages.LOGIN_SUCCESSFULLY });
  }

  @UseGuards()
  @Post('log-out')
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.usersService.removeRefreshToken(req.user._id);

    res.cookie('refresh_token', '', {
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
