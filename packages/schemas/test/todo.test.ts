import { describe, it, expect } from 'vitest'
import {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  TodoListResponseSchema,
} from '../src/todo'

describe('TodoSchema', () => {
  const validTodo = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test todo',
    description: 'A test description',
    completed: false,
    userId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  it('should validate a valid todo', () => {
    const result = TodoSchema.safeParse(validTodo)
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID for id', () => {
    const result = TodoSchema.safeParse({ ...validTodo, id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('should reject empty title', () => {
    const result = TodoSchema.safeParse({ ...validTodo, title: '' })
    expect(result.success).toBe(false)
  })

  it('should reject title over 200 characters', () => {
    const result = TodoSchema.safeParse({ ...validTodo, title: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('should allow optional description', () => {
    const todoWithoutDesc = { ...validTodo }
    delete (todoWithoutDesc as any).description
    const result = TodoSchema.safeParse(todoWithoutDesc)
    expect(result.success).toBe(true)
  })

  it('should default completed to false', () => {
    const todoWithoutCompleted = { ...validTodo }
    delete (todoWithoutCompleted as any).completed
    const result = TodoSchema.parse(todoWithoutCompleted)
    expect(result.completed).toBe(false)
  })
})

describe('CreateTodoSchema', () => {
  it('should validate valid create input', () => {
    const result = CreateTodoSchema.safeParse({
      title: 'New todo',
      description: 'Description',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty title', () => {
    const result = CreateTodoSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('should allow missing description', () => {
    const result = CreateTodoSchema.safeParse({ title: 'Just a title' })
    expect(result.success).toBe(true)
  })
})

describe('UpdateTodoSchema', () => {
  it('should allow partial updates', () => {
    const result = UpdateTodoSchema.safeParse({ completed: true })
    expect(result.success).toBe(true)
  })

  it('should allow empty object', () => {
    const result = UpdateTodoSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should validate title if provided', () => {
    const result = UpdateTodoSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })
})

describe('TodoListResponseSchema', () => {
  it('should validate list response with pagination', () => {
    const response = {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test',
          completed: false,
          userId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
      },
    }
    const result = TodoListResponseSchema.safeParse(response)
    expect(result.success).toBe(true)
  })

  it('should reject invalid pagination', () => {
    const response = {
      data: [],
      pagination: {
        page: 0, // must be positive
        limit: 10,
        total: 0,
      },
    }
    const result = TodoListResponseSchema.safeParse(response)
    expect(result.success).toBe(false)
  })
})
