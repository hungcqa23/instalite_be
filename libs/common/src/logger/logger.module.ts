import { WinstonModule } from 'nest-winston';

import { Module } from '@nestjs/common';

import loggerConfig from './wiston-config.logger';

@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  exports: [WinstonModule]
})
export class LoggerModule {}
