import { z } from "zod";

// ============================================
// Todo Schema
// ============================================

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  completed: z.boolean().default(false),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;

// ============================================
// Create Todo
// ============================================

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;

// ============================================
// Update Todo
// ============================================

export const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;

// ============================================
// Todo List Response
// ============================================

export const TodoListResponseSchema = z.object({
  data: z.array(TodoSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
});

export type TodoListResponse = z.infer<typeof TodoListResponseSchema>;
