import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { TokenPayLoad } from './interfaces/tokens.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refresh_token
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: TokenPayLoad) {
    const refreshToken = req.cookies?.refresh_token || '';
    const user = await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.sub);
    return user;
  }
}
