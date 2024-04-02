import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation';
import { CreateUserDto, createUserSchema } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
}
