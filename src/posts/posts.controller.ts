import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
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
import LocalFilesInterceptor from 'src/files/interceptor/local-file.interceptor';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createNewPost(
    @Body() body: CreatePostDto,
    @Req() req: RequestWithUser
  ) {
    const post = await this.postsService.create({
      ...body,
      user_id: req.user.id
    });

    return {
      message: PostMessages.CREATE_POST_SUCCESSFULLY,
      post
    };
  }

  @Put(':id/upload-hls')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'media'
    })
  )
  async uploadVideoHLS(
    @Param() { id }: GetPostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const url_media = await this.postsService.uploadVideoHLS(file, id);
    return {
      message: url_media
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async uploadPost(
    @Param() { id }: GetPostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({
            fileType: 'image/png|image/jpeg|image/jpg|video/*'
          })
        ]
      })
    )
    file?: Express.Multer.File
  ) {
    const url_media = await this.postsService.uploadMedia(id, file);
    return {
      message: PostMessages.UPLOAD_MEDIA_SUCCESSFULLY,
      url_media
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

  @Get()
  async getAllPosts() {
    const posts = await this.postsService.getAllPosts();
    return {
      message: PostMessages.GET_ALL_POSTS_SUCCESSFULLY,
      result: posts
    };
  }

  @Get(':id/comments')
  async getComments(@Param() { id }: GetPostDto) {
    const comments = await this.postsService.getComments(id);
    return {
      message: PostMessages.GET_COMMENTS_SUCCESSFULLY,
      result: comments
    };
  }

  @Get(':username/username')
  async getPostsByUsername(@Param() { username }: { username: string }) {
    const posts = await this.postsService.getPostsByUsername(username);
    return {
      message: 'Get posts by username successfully',
      result: posts
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() { id }: GetPostDto, @Req() req: RequestWithUser) {
    await this.postsService.deletePost(id, req.user.id);
    return {
      message: PostMessages.DELETE_POST_SUCCESSFULLY
    };
  }

  @Patch(':id')
  async updatePost(@Param() { id }: GetPostDto, @Body() body: UpdatePostDto) {
    const post = await this.postsService.updatePost(id, body);
    return {
      message: PostMessages.UPDATE_POST_SUCCESSFULLY,
      post
    };
  }
}
