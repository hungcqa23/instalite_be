import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayLoad } from 'src/auth/types/tokens.type';
import { UsersService } from 'src/users/users.service';

export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        }
      ])
    });
  }

  async validate(req: Request, payload: TokenPayLoad) {
    const refreshToken = req.cookies?.refresh_token;
    return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
  }
}
