import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation';
import { CreateUserDto, createUserSchema } from 'src/auth/dtos/create-user.dto';
import { LoginBodyDto, loginBodySchema } from 'src/auth/dtos/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(loginBodySchema))
  logIn(@Body() logInDto: LoginBodyDto) {
    return this.authService.logIn(logInDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('log-out')
  @UseGuards()
  @Get('refresh')
  refreshToken() {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
