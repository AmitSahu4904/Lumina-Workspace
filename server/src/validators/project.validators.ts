import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters'),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters').optional(),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
  }),
});
