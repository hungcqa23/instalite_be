import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(250)
  bio: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  username: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  fullName: string;
}
