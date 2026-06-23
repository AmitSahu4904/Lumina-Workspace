import { z } from 'zod';

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'User email is required' }).email('Invalid email address'),
  }),
});
