import { IsMongoId, IsString } from 'class-validator';

export class LikePostDto {
  @IsMongoId()
  @IsString()
  postId: string;
}
