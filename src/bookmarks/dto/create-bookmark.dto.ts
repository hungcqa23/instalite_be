import { IsMongoId, IsString } from 'class-validator';

export class CreateBookMarkDto {
  @IsMongoId()
  @IsString()
  postId: string;
}
