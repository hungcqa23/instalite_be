import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from '~/auth/jwt-refresh-token.strategy';
import { LocalStrategy } from '~/auth/local.strategy';
import { EmailModule } from '~/email/email.module';
import { UsersModule } from '~/users/users.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    EmailModule,
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
