import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { LogInDto } from 'src/auth/dtos/log-in.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  signIn(@Body() logInDto: LogInDto) {
    return this.usersService.findOne(logInDto.username);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
