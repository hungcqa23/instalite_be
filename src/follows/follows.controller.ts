import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { UserMessages } from 'src/constants/messages';
import { CreateFollowDto } from 'src/users/dto/create-follow.dto';
import { UnFollowDto } from 'src/users/dto/un-follow-dto';
import { FollowsService } from 'src/follows/follows.service';

@UseGuards(JwtAccessTokenGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async follow(@Req() req: RequestWithUser, @Body() createFollowDto: CreateFollowDto, @Res() res: Response) {
    const result = await this.followsService.createFollow(req.user._id, createFollowDto.followedUserId);

    return res.send({
      message: UserMessages.FOLLOW_SUCCESSFULLY,
      data: {
        result
      }
    });
  }

  @Delete()
  async unfollow(@Req() req: RequestWithUser, @Body() unFollowDto: UnFollowDto) {
    const result = await this.followsService.unfollow(req.user._id, unFollowDto.followedUserId);
  }
}
