import { Module } from '@nestjs/common';

import { EmailService } from '../email/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
