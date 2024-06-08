import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { EncodeByResolution } from 'src/files/types/encode.type';

@Injectable()
export class FilesService {
  MAXIMUM_BITRATE_720P = 5 * 10 ** 6; // 5Mbps
  MAXIMUM_BITRATE_1080P = 8 * 10 ** 6; // 8Mbps
  MAXIMUM_BITRATE_1440P = 16 * 10 ** 6; // 16Mbps

  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
      }
    });
  }
  private async checkVideoHasAudio(filePath: string) {
    const slash = (await import('slash')).default;
    const { $ } = await import('zx');
    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=bit_rate',
      '-of',
      'default=nw=1:nk=1',
      slash(filePath)
    ]}`;
    return stdout.trim() === 'audio';
  }

  private async getBitrate(filePath: string) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;
    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=bit_rate',
      '-of',
      'default=nw=1:nk=1',
      slash(filePath)
    ]}`;
    return Number(stdout.trim());
  }

  private async getResolution(filePath: string) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;
    const { stdout } = await $`ffprobe ${[
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-of',
      'csv=s=x:p=0',
      slash(filePath)
    ]}`;
    const resolution = stdout.trim().split('x');
    const [width, height] = resolution;
    return {
      width: Number(width),
      height: Number(height)
    };
  }

  private getWidth(height: number, resolution: { width: number; height: number }) {
    const width = Math.round((height * resolution.width) / resolution.height);
    // Because ffmpeg use yuv420p format, width must be even
    return width % 2 === 0 ? width : width + 1;
  }

  private async encodeMax720({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution
  }: EncodeByResolution) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = [
      '-y',
      '-i',
      slash(inputPath),
      '-preset',
      'veryslow',
      '-g',
      '48',
      '-crf',
      '17',
      '-sc_threshold',
      '0',
      '-map',
      '0:0'
    ];

    if (isHasAudio) args.push('-map', '0:1');

    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-c:a',
      'copy',
      '-var_stream_map'
    );

    if (isHasAudio) {
      args.push('v:0,a:0');
    } else {
      args.push('v:0');
    }
    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath)
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  private async encodeMax1080({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution
  }: EncodeByResolution) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = ['-y', '-i', slash(inputPath), '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];
    if (isHasAudio) {
      args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
    } else {
      args.push('-map', '0:0', '-map', '0:0');
    }
    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-c:a',
      'copy',
      '-var_stream_map'
    );

    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1');
    } else {
      args.push('v:0 v:1');
    }

    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath)
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  private async encodeMax1440({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution
  }: EncodeByResolution) {
    console.log('Clg this');
    console.log(this);
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = ['-y', '-i', slash(inputPath), '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];

    if (isHasAudio) {
      args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
    } else {
      args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
    }

    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-s:v:2',
      `${this.getWidth(1440, resolution)}x1440`,
      '-c:v:2',
      'libx264',
      '-b:v:2',
      `${bitrate[1440]}`,
      '-c:a',
      'copy',
      '-var_stream_map'
    );

    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1 v:2,a:2');
    } else {
      args.push('v:0 v:1 v2');
    }

    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath)
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  private async encodeMaxOriginal({
    bitrate,
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution
  }: EncodeByResolution) {
    const { $ } = await import('zx');
    const slash = (await import('slash')).default;

    const args = ['-y', '-i', slash(inputPath), '-preset', 'veryslow', '-g', '48', '-crf', '17', '-sc_threshold', '0'];
    if (isHasAudio) {
      args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
    } else {
      args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
    }

    args.push(
      '-s:v:0',
      `${this.getWidth(720, resolution)}x720`,
      '-c:v:0',
      'libx264',
      '-b:v:0',
      `${bitrate[720]}`,
      '-s:v:1',
      `${this.getWidth(1080, resolution)}x1080`,
      '-c:v:1',
      'libx264',
      '-b:v:1',
      `${bitrate[1080]}`,
      '-s:v:2',
      `${resolution.width}x${resolution.height}`,
      '-c:v:2',
      'libx264',
      '-b:v:2',
      `${bitrate.original}`,
      '-c:a',
      'copy',
      '-var_stream_map'
    );

    if (isHasAudio) {
      args.push('v:0,a:0 v:1,a:1 v:2,a:2');
    } else {
      args.push('v:0 v:1 v2');
    }

    args.push(
      '-master_pl_name',
      'master.m3u8',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_list_size',
      '0',
      '-hls_segment_filename',
      slash(outputSegmentPath),
      slash(outputPath)
    );

    await $`ffmpeg ${args}`;
    return true;
  }

  public async encodeHLSWithMultipleVideoStreams(inputPath: string) {
    const [bitrate, resolution] = await Promise.all([this.getBitrate(inputPath), this.getResolution(inputPath)]);
    const parentFolder = path.join(inputPath, '..');

    const outputSegmentPath = path.join(parentFolder, 'v%v/fileSequence%d.ts');
    const outputPath = path.join(parentFolder, 'v%v/prog_index.m3u8');
    const bitrate720 = bitrate > this.MAXIMUM_BITRATE_720P ? this.MAXIMUM_BITRATE_720P : bitrate;
    const bitrate1080 = bitrate > this.MAXIMUM_BITRATE_1080P ? this.MAXIMUM_BITRATE_1080P : bitrate;
    const bitrate1440 = bitrate > this.MAXIMUM_BITRATE_1440P ? this.MAXIMUM_BITRATE_1440P : bitrate;
    const isHasAudio = await this.checkVideoHasAudio(inputPath);

    if (resolution.height > 1440)
      this.encodeMaxOriginal({
        bitrate: {
          720: bitrate720,
          1080: bitrate1080,
          1440: bitrate1440,
          original: bitrate
        },
        inputPath,
        isHasAudio,
        outputPath,
        outputSegmentPath,
        resolution
      });
    else if (resolution.height > 720)
      this.encodeMax1080({
        bitrate: { 720: bitrate720, 1080: bitrate1080, 1440: bitrate1440, original: bitrate },
        inputPath,
        isHasAudio,
        outputPath,
        outputSegmentPath,
        resolution
      });
    else
      this.encodeMax720({
        bitrate: { 720: bitrate720, 1080: bitrate1080, 1440: bitrate1440, original: bitrate },
        inputPath,
        isHasAudio,
        outputPath,
        outputSegmentPath,
        resolution
      });

    return true;
  }

  public async uploadFile(file: Express.Multer.File) {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
        Key: `${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }
    });
    return await upload.done();
  }

  public async deleteFile(url: string) {
    this.s3.deleteObject({ Bucket: this.configService.get<string>('AWS_BUCKET_NAME'), Key: url });
  }
}
