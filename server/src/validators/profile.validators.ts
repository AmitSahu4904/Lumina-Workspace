import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  }),
});
