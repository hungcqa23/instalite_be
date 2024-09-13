import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule
} from '@nestjs/config';

import baseConfig, { validationSchema } from './base.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [baseConfig],
      validationSchema
    })
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
