import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  async getNotifications(
    @Req()
    req: RequestWithUser
  ) {
    const result = await this.notificationsService.getNotifications(req.user.id);
    return {
      message: 'Get notifications successfully',
      result
    };
  }
}
