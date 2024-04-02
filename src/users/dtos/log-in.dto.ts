import { z } from 'zod';

export const loginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict();

export type LoginBodyDto = z.infer<typeof loginBody>;
