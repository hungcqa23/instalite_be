import { Strategy } from 'passport-local';
import { AuthService } from '~/auth/auth.service';
import { UserDocument } from '~/users/user.schema';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = this.authService.getAuthenticatedUser(email, password);
    return user;
  }
}
