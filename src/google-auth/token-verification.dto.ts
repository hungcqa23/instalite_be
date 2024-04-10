import { IsNotEmpty, IsString } from 'class-validator';

export default class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
