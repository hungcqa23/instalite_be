import { IsMongoId, IsString } from 'class-validator';

export class UnFollowDto {
  @IsMongoId()
  @IsString()
  followedUserId: string;
}
