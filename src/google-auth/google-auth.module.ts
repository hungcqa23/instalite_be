import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}
