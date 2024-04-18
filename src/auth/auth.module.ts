import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from 'src/auth/jwt-refresh-token.strategy';
import { LocalStrategy } from 'src/auth/local.strategy';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, JwtModule, EmailModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
