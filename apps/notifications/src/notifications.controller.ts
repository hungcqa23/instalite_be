import { NotifyEmailDto } from 'apps/notifications/src/dto/notify-email.dto';

import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notify_email')
  @UsePipes(new ValidationPipe())
  async notifyEmail(@Payload() payload: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(payload);
  }
}
