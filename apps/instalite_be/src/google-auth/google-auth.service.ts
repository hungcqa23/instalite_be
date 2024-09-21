import { Auth, google } from 'googleapis';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient
    });
    return userInfoResponse.data;
  }

  private async getCookiesForUser(user: UserDocument) {
    // const accessTokenCookie = this.authService.getCookiesForUser(user);
    return user;
  }

  private async handleRegisteredUser(user: UserDocument) {
    if (!user.isRegisteredViaOauthGoogle) throw new UnauthorizedException();

    // const { accessTokenCookie, refreshTokenCookie } = await this.getCookiesForUser(user);

    return {
      user
    };
  }

  private async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const name = userData.name;

    const user = await this.usersService.signUpWithGoogle(email, name);
    return this.handleRegisteredUser(user);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const email = tokenInfo.email;

    try {
      const user = await this.usersService.getUserByEmail(email);
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }

      return this.registerUser(token, email);
    }
  }
}
