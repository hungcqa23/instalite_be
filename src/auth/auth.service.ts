import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { LogInDto } from 'src/auth/dtos/log-in.dto';
import { UserMessages } from 'src/constants/messages';
import { UsersService } from 'src/users/users.service';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  public async signUp(createUserDto: CreateUserDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword
      });
      const token = await this.signRefreshAndAccessTokens(
        newUser._id,
        newUser.username
      );
      await this.usersService.updateRefreshToken(
        newUser._id,
        token.refreshToken
      );
      return token;
    } catch (error) {
      throw new BadRequestException('Email or username already in use');
    }
  }

  public async logIn(logInDto: LogInDto) {
    const user = await this.usersService.findByEmail(logInDto.email);

    if (!user) throw new UnauthorizedException('User is not found');

    const isPasswordValid = await bcrypt.compare(
      logInDto.password,
      user.password
    );
    if (!isPasswordValid)
      throw new UnauthorizedException(`Password doesn't match`);
    const tokens = await this.signRefreshAndAccessTokens(
      user._id,
      user.username
    );
    await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
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
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
          )
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
          )
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
