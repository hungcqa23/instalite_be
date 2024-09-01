import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'files'
    })
  ],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
