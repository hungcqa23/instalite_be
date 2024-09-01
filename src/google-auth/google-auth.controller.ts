import 'express';
import { GoogleAuthService } from 'src/google-auth/google-auth.service';
import TokenVerificationDto from 'src/google-auth/token-verification.dto';

import { Body, Controller, Post } from '@nestjs/common';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  async authenticate(
    @Body()
    tokenData: TokenVerificationDto
  ) {
    const { user } = await this.googleAuthService.authenticate(tokenData.token);

    // res.cookie('refresh_token', refreshTokenCookie, {
    //   httpOnly: true
    // });
    // res.cookie('access_token', accessTokenCookie, {
    //   httpOnly: true
    // });

    return user;
  }
}
