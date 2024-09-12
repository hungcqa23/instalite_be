import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { PostType } from 'src/constants/enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsEnum(PostType)
  typePost: PostType;

  @IsOptional()
  @IsMongoId({
    message: 'Invalid parentPostId'
  })
  parentPostId: string;
}
