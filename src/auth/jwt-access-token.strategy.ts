import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayLoad } from '~/auth/types/tokens.type';
import { UsersService } from '~/users/users.service';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.access_token
      ]),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
    });
  }

  async validate(payload: TokenPayLoad) {
    return this.usersService.getUserById(payload.sub);
  }
}
