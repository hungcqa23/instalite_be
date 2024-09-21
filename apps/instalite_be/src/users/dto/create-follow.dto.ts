import { IsMongoId, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsMongoId()
  @IsString()
  followedUserId: string;
}
