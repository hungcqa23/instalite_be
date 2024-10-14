import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { LikePostDto } from '../likes/dto/like.dto';
import { LikesService } from '../likes/likes.service';

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
    const result = await this.likesService.likePost(req.user._id.toString(), likePostDto.postId);

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
      req.user._id.toString(),
      unlikePostDto.postId
    );
    return {
      message: 'Unlike post',
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
    const result = await this.likesService.isLikedPost(req.user._id.toString(), postId);

    return {
      message: 'Check if post is liked',
      result
    };
  }
}
