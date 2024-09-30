import { BookmarkMessages } from '@app/common/constants/messages';

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

import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { CreateBookMarkDto } from '../bookmarks/dto/create-bookmark.dto';

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
    const data = await this.bookmarksService.bookmarkPost(
      req.user._id.toString(),
      createBookMarkDto.postId
    );

    return {
      message: BookmarkMessages.CREATE_BOOKMARK_SUCCESSFULLY,
      data
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
    const data = await this.bookmarksService.unBookmark(
      req.user._id.toString(),
      createBookMarkDto.postId
    );

    return {
      message: 'Deleted bookmark',
      data
    };
  }

  @Get('/:postId/check')
  public async isBookmarkedPost(
    @Req()
    req: RequestWithUser,
    @Param('postId')
    postId: string
  ) {
    const data = await this.bookmarksService.isBookmarkedPost(
      req.user._id.toString(),
      postId
    );

    return {
      message: 'Check if post is bookmarked',
      data
    };
  }

  @Get('/me')
  public async getAllBookmarkedPosts(
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.bookmarksService.getAllBookmarkedPosts(
      req.user._id.toString()
    );
    return {
      message: 'Get all bookmarked posts',
      data
    };
  }
}
