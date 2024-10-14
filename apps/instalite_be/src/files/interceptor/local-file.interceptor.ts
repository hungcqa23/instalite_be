import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const folderDestination = configService.get('UPLOAD_DIR');
      const pathName = path.join(__dirname, '..', '..', '..', folderDestination);
      // const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const filesDestination = path.join(pathName, options.path || req.params.id);
            fs.mkdirSync(filesDestination, {
              recursive: true
            });
            cb(null, filesDestination);
          },
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          }
        }),
        fileFilter: options.fileFilter,
        limits: options.limits
      };

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
