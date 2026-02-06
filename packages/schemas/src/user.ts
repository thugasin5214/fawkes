import { z } from "zod";

// ============================================
// User Schema
// ============================================

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================
// Auth Schemas
// ============================================

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
  expiresAt: z.string().datetime(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
