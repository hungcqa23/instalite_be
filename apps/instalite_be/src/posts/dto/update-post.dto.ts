import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content: string;
}
