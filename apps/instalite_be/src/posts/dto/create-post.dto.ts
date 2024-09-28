import { PostType } from '@app/common/constants/enum';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsEnum(PostType)
  typePost: PostType;

  @IsOptional()
  @IsMongoId({
    message: 'Invalid Paren Post Id'
  })
  parentPostId: string;
}
