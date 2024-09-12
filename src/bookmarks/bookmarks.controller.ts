import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { CreateBookMarkDto } from 'src/bookmarks/dto/create-bookmark.dto';

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
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  public async bookmarkPost(
    @Req()
    req: RequestWithUser,
    @Body()
    createBookMarkDto: CreateBookMarkDto
  ) {
    const result = await this.bookmarksService.bookmarkPost(
      req.user._id.toString(),
      createBookMarkDto.postId
    );

    return {
      message: 'Created bookmark',
      result
    };
  }

  @Get()
  public async getBookmarkedPosts(
    @Req()
    req: RequestWithUser
  ) {
    return await this.bookmarksService.getBookmarkedPosts(
      req.user._id.toString()
    );
  }

  @Delete()
  public async unBookmark(
    @Req()
    req: RequestWithUser,
    @Body()
    createBookMarkDto: CreateBookMarkDto
  ) {
    const result = await this.bookmarksService.unBookmark(
      req.user._id.toString(),
      createBookMarkDto.postId
    );

    return {
      message: 'Deleted bookmark',
      result
    };
  }

  @Get('/:postId/check')
  public async isBookmarkedPost(
    @Req()
    req: RequestWithUser,
    @Param('postId')
    postId: string
  ) {
    const result = await this.bookmarksService.isBookmarkedPost(
      req.user._id.toString(),
      postId
    );

    return {
      message: 'Check if post is bookmarked',
      result
    };
  }

  @Get('/me')
  public async getAllBookmarkedPosts(
    @Req()
    req: RequestWithUser
  ) {
    return await this.bookmarksService.getAllBookmarkedPosts(
      req.user._id.toString()
    );
  }
}
