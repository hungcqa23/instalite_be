import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeSchema } from 'src/likes/like.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }])],
  providers: [LikesService],
  exports: [LikesService]
})
export class LikesModule {}
