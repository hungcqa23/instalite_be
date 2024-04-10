import { Body, Controller, Post, Req } from '@nestjs/common';
import TokenVerificationDto from 'src/google-auth/token-verification.dto';
import { Request } from 'express';
import { GoogleAuthService } from 'src/google-auth/google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  async authenticate(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
    const { accessTokenCookie, refreshTokenCookie, user } = await this.authService.authenticate(tokenData);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return user;
  }
}
