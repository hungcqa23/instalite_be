import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController],
  exports: [GoogleAuthService],
  imports: [UsersModule, AuthModule]
})
export class GoogleAuthModule {}
