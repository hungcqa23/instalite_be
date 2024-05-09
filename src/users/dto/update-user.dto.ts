import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  bio: string;
}
