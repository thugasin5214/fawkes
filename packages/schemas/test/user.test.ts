import { describe, it, expect } from 'vitest'
import {
  UserSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
} from '../src/user'

describe('UserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  it('should validate a valid user', () => {
    const result = UserSchema.safeParse(validUser)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = UserSchema.safeParse({ ...validUser, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid UUID', () => {
    const result = UserSchema.safeParse({ ...validUser, id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('should allow optional name', () => {
    const userWithoutName = { ...validUser }
    delete (userWithoutName as any).name
    const result = UserSchema.safeParse(userWithoutName)
    expect(result.success).toBe(true)
  })

  it('should allow optional avatarUrl', () => {
    const userWithoutAvatar = { ...validUser }
    delete (userWithoutAvatar as any).avatarUrl
    const result = UserSchema.safeParse(userWithoutAvatar)
    expect(result.success).toBe(true)
  })

  it('should reject invalid avatarUrl', () => {
    const result = UserSchema.safeParse({ ...validUser, avatarUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })
})

describe('LoginRequestSchema', () => {
  it('should validate valid login request', () => {
    const result = LoginRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = LoginRequestSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('should reject short password', () => {
    const result = LoginRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
    }
  })
})

describe('LoginResponseSchema', () => {
  it('should validate valid login response', () => {
    const response = {
      token: 'jwt-token-here',
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      expiresAt: '2026-01-02T00:00:00.000Z',
    }
    const result = LoginResponseSchema.safeParse(response)
    expect(result.success).toBe(true)
  })
})

describe('RegisterRequestSchema', () => {
  it('should validate valid register request', () => {
    const result = RegisterRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })
    expect(result.success).toBe(true)
  })

  it('should reject missing name', () => {
    const result = RegisterRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty name', () => {
    const result = RegisterRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('should reject name over 100 characters', () => {
    const result = RegisterRequestSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})
