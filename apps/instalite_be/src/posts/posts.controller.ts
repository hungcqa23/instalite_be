import { PostMessages } from '@app/common/constants/messages';
import { PageOptionsDto } from '@app/common/pagination/page-options.dto';

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
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import LocalFilesInterceptor from '../files/interceptor/local-file.interceptor';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { GetPostDto } from '../posts/dto/get-post.dto';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
import { PostsService } from '../posts/posts.service';

@UseGuards(JwtAccessTokenGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(@Query() pageOptionsDto: PageOptionsDto) {
    const data = await this.postsService.getAllPosts(pageOptionsDto);

    return {
      message: PostMessages.GET_ALL_POSTS_SUCCESSFULLY,
      data
    };
  }

  @Post()
  async createNewPost(
    @Body()
    body: CreatePostDto,
    @Req()
    req: RequestWithUser
  ) {
    const data = await this.postsService.create({
      ...body,
      userId: req.user.id
    });

    return {
      message: PostMessages.CREATE_POST_SUCCESSFULLY,
      data
    };
  }

  @Put(':id/upload-hls')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'media'
    })
  )
  async uploadVideoHLS(
    @Param()
    { id }: GetPostDto,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    const message = await this.postsService.uploadVideoHLS(file, id);
    return {
      message
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('media'))
  async uploadPost(
    @Param()
    { id }: GetPostDto,
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
  async getPostById(
    @Param()
    { id }: GetPostDto
  ) {
    const data = await this.postsService.getPostById(id);
    return {
      message: PostMessages.GET_POST_SUCCESSFULLY,
      data
    };
  }

  @Get(':id/comments')
  async getComments(
    @Param()
    { id }: GetPostDto
  ) {
    const data = await this.postsService.getComments(id);

    return {
      message: PostMessages.GET_COMMENTS_SUCCESSFULLY,
      data
    };
  }

  @Get(':username/username')
  async getPostsByUsername(
    @Param()
    { username }: { username: string }
  ) {
    const data = await this.postsService.getPostsByUsername(username);
    return {
      message: PostMessages.GET_POST_SUCCESSFULLY,
      data
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param()
    { id }: GetPostDto,
    @Req()
    req: RequestWithUser
  ) {
    await this.postsService.deletePost(id, req.user.id);
    return {
      message: PostMessages.DELETE_POST_SUCCESSFULLY
    };
  }

  @Patch(':id')
  async updatePost(
    @Param()
    { id }: GetPostDto,
    @Body()
    body: UpdatePostDto
  ) {
    const data = await this.postsService.updatePost(id, body);
    return {
      message: PostMessages.UPDATE_POST_SUCCESSFULLY,
      data
    };
  }
}
