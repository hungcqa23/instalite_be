import { userSchema } from './create-user.dto';

export const updateUserSchema = userSchema.partial();
