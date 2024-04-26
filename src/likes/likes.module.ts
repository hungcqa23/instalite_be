import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';

@Module({
  providers: [LikesService]
})
export class LikesModule {}
