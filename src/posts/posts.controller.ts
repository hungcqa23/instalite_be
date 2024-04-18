import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { PostMessages } from 'src/constants/messages';
import { PostsService } from 'src/posts/posts.service';
import { CreatePostDto } from 'src/posts/type/create-post.dto';
import { GetPostDto } from 'src/posts/type/get-post.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createNewPost(@Body() body: CreatePostDto, @Req() req: RequestWithUser) {
    const post = await this.postsService.create({
      ...body,
      user_id: req.user.id
    });

    return {
      message: PostMessages.CREATE_POST_SUCCESSFULLY,
      post
    };
  }

  @Get(':id')
  async getPostById(@Param() { id }: GetPostDto) {
    const post = await this.postsService.getPostById(id);

    return {
      message: PostMessages.GET_POST_SUCCESSFULLY,
      post
    };
  }
}
