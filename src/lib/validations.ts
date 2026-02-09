import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']),
});

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  projectId: z.uuid(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
