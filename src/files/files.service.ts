import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FilesService {
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

  
}
