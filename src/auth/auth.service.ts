import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
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
    const userExists = await this.usersService.findByUserName(createUserDto.username);

    if (userExists) throw new BadRequestException('User already exists');

    // Hash password
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash
    });
    const token = await this;
  }

  private async signRefreshAndAccessTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userid,
          username
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        }
      )
    ]);

    return { accessToken, refreshToken };
  }
}
