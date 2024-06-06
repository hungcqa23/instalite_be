import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;
}
