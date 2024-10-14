import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, JwtModule, EmailModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
