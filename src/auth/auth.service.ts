import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) throw new BadRequestException('User already exists');

    // Hash password
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash
    });

    const token = await this.signRefreshAndAccessTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, token.refreshToken);
    return token;
  }

  async logIn(logInDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(logInDto.email);

    if (!user) throw new UnauthorizedException('User is not found');

    const isPasswordValid = await bcrypt.compare(logInDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(`Password doesn't match`);
    const tokens = await this.signRefreshAndAccessTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  private async signRefreshAndAccessTokens(userId: string, username: string) {
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

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }
    await this.verifyPassword(password, user.password);
    return user;
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials');
    }
  }
}
