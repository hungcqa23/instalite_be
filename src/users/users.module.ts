import { BookmarksModule } from '~/bookmarks/bookmarks.module';
import { FilesModule } from '~/files/files.module';
import { LikesModule } from '~/likes/likes.module';
import { NotificationsModule } from '~/notifications/notifications.module';
import { Follow, FollowSchema } from '~/users/follow.schema';
import { User, UserSchema } from '~/users/user.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Follow.name,
        schema: FollowSchema
      }
    ]),
    FilesModule,
    LikesModule,
    BookmarksModule,
    NotificationsModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
