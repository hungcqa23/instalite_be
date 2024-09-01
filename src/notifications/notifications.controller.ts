import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { NotificationsService } from 'src/notifications/notifications.service';

import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@UseGuards(JwtAccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  async getNotifications(
    @Req()
    req: RequestWithUser
  ) {
    const result = await this.notificationsService.getNotifications(
      req.user.id
    );
    return {
      message: 'Get notifications successfully',
      result
    };
  }
}
