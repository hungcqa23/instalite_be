import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from 'src/files/files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/video-hls/:id/master.m3u8')
  getMasterM3U8(@Param('id') id: string, @Res() res: Response) {
    const result = this.filesService.getMasterM3U8(id);

    return res.sendFile(result, err => {
      if (err) {
        console.log('Not found error');
      }
    });
  }

  @Get('/video-hls/:id/:v/:segment')
  getIndexM3U8(
    @Param('id') id: string,
    @Param('v') v: string,
    @Param('segment') segment: string,
    @Res() res: Response
  ) {
    const result = this.filesService.getSegment(id, v, segment);
    res.sendFile(result, err => {
      if (err) {
        console.log('Not found error');
      }
    });
    // return res.sendFile(result, err => {
    //   if (err) {
    //     console.log('Not found error');
    //   }
    // });
  }
}
