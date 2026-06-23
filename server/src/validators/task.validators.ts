import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Task title is required' }).min(3, 'Task title must be at least 3 characters').max(100, 'Task title must not exceed 100 characters'),
    description: z.string().max(1000, 'Task description must not exceed 1000 characters').optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    assigned_to: z.string().uuid('Invalid assignee ID').optional().nullable(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format').optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Task title must be at least 3 characters').max(100, 'Task title must not exceed 100 characters').optional(),
    description: z.string().max(1000, 'Task description must not exceed 1000 characters').optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    assigned_to: z.string().uuid('Invalid assignee ID').optional().nullable(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format').optional().nullable(),
  }),
});
