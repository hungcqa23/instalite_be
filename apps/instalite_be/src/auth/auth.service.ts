import { UserMessages } from '@app/common/constants/messages';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly SERVICE_NAME = AuthService.name;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  public async signUp(createUserDto: CreateUserDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword
      });
      const token = await this.signRefreshAndAccessTokens(newUser._id.toString(), newUser.username);
      await this.usersService.updateRefreshToken(newUser._id.toString(), token.refreshToken);

      this.logger.log({
        level: 'info',
        message: `User signed up successfully - ${newUser._id.toString()}`,
        context: this.SERVICE_NAME
      });

      return { token, newUser };
    } catch {
      throw new BadRequestException('Email or username already in use');
    }
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(UserMessages.NOT_FOUND);
    }
    await this.verifyPassword(password, user.password);
    return user;
  }

  public async signRefreshAndAccessTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
        }
      )
    ]);
    await this.usersService.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken
    };
  }

  public sendCookie(res: Response, key: string, value: string) {
    res.cookie(key, value, {
      httpOnly: true
    });
  }

  public sendTokenViaCookie(
    res: Response,
    token: {
      accessToken: string;
      refreshToken: string;
    }
  ) {
    this.sendCookie(res, 'access_token', token.accessToken);
    this.sendCookie(res, 'refresh_token', token.refreshToken);
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong password');
    }
  }
}
