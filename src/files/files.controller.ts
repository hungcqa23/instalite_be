import { Response } from 'express';
import { FilesService } from '~/files/files.service';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/video-hls/:id/master.m3u8')
  getMasterM3U8(
    @Param('id')
    id: string,
    @Res()
    res: Response
  ) {
    const result = this.filesService.getMasterM3U8(id);

    return res.sendFile(result, err => {
      if (err) {
        console.log('Error');
      }
    });
  }

  @Get('/video-hls/:id/:v/:segment')
  getIndexM3U8(
    @Param('id')
    id: string,
    @Param('v')
    v: string,
    @Param('segment')
    segment: string,
    @Res()
    res: Response
  ) {
    const result = this.filesService.getSegment(id, v, segment);
    res.sendFile(result, err => {
      if (err) {
        console.log('Error');
      }
    });
  }

  @Post('/summary')
  @UseInterceptors(FileInterceptor('media'))
  async getSummaryContent(
    @Body()
    body: {
      content: string;
    },
    @UploadedFile()
    file?: Express.Multer.File
  ) {
    const result = await this.filesService.getSummaryContent(body, file);
    return {
      content: result
    };
  }
}
