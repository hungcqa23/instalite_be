import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema } from 'src/follows/follow.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]), UsersModule],
  providers: [FollowsService],
  controllers: [FollowsController]
})
export class FollowsModule {}
