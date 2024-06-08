import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [UsersModule]
})
export class NotificationsModule {}
