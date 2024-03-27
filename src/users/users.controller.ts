import { Body, Controller, Get } from '@nestjs/common';
import { LogInDto } from 'src/users/dtos/log-in.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  signIn(@Body() logInDto: LogInDto) {
    return this.usersService.findOne(logInDto.username);
  }
}
