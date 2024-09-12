import { EmailService } from '~/email/email.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
