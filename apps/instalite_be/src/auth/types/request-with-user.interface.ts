import { Request } from 'express';

import { UserDocument } from '../../users/user.schema';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
