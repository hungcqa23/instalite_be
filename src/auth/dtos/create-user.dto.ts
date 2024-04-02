import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string().trim().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    refreshToken: z.string().optional()
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
