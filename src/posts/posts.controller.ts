import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessTokenGuard } from 'src/auth/jwt-access-token.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { PostMessages } from 'src/constants/messages';
import { PostsService } from 'src/posts/posts.service';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { GetPostDto } from 'src/posts/dto/get-post.dto';

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

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FileInterceptor('media'))
  async uploadPost(
    @Param() { id }: GetPostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/png|image/jpeg|image/jpg|video/*' })]
      })
    )
    file?: Express.Multer.File
  ) {
    if (file) {
      const url_media = await this.postsService.uploadMedia(file, id);
      return {
        message: PostMessages.UPLOAD_MEDIA_SUCCESSFULLY,
        url_media
      };
    }
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
