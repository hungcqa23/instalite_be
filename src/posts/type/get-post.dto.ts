import { IsMongoId } from 'class-validator';

export class GetPostDto {
  @IsMongoId({
    message: 'Please enter a valid id'
  })
  id: string;
}
