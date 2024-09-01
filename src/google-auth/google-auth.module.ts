import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';

import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController],
  exports: [GoogleAuthService],
  imports: [UsersModule, AuthModule]
})
export class GoogleAuthModule {}
