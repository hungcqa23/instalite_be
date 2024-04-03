import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string().trim().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    refreshToken: z.string().optional()
  })
  .strict();

export const createUserSchema = userSchema.superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['confirmPassword']
    });
  }
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
