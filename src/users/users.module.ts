import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { FilesModule } from 'src/files/files.module';
import { LikesModule } from 'src/likes/likes.module';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { Follow, FollowSchema } from 'src/users/follow.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema }
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
