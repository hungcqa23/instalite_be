import { IsEmail, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}
