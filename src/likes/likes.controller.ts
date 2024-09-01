import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { LikePostDto } from 'src/likes/dto/like.dto';
import { LikesService } from 'src/likes/likes.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

@UseGuards(JwtAccessTokenGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  public async likePost(
    @Req()
    req: RequestWithUser,
    @Body()
    likePostDto: LikePostDto
  ) {
    const result = await this.likesService.likePost(
      req.user._id,
      likePostDto.postId
    );

    return {
      message: 'Liked post',
      result
    };
  }

  @Delete()
  public async unlikePost(
    @Req()
    req: RequestWithUser,
    @Body()
    unlikePostDto: LikePostDto
  ) {
    const result = await this.likesService.unlikePost(
      req.user._id,
      unlikePostDto.postId
    );
    return {
      message: 'Unliked post',
      result
    };
  }

  @Get(':postId')
  public async isLikedPost(
    @Req()
    req: RequestWithUser,
    @Param('postId')
    postId: string
  ) {
    const result = await this.likesService.isLikedPost(req.user._id, postId);

    return {
      message: 'Check if post is liked',
      result
    };
  }
}
