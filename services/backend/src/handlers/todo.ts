import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoSchema, UpdateTodoSchema } from '@repo/schemas'
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../domain/todo'

// 辅助函数：创建响应
const response = (statusCode: number, body: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
})

// 辅助函数：从event获取用户ID（实际项目中从JWT解析）
const getUserId = (event: any): string => {
  // TODO: 实际项目中从Authorization header解析JWT
  return event.requestContext?.authorizer?.claims?.sub || 'anonymous'
}

/**
 * GET /api/todos
 * 获取当前用户的所有todos
 */
export const listHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const todos = await getTodos(userId)
    return response(200, { data: todos })
  } catch (error) {
    console.error('Error listing todos:', error)
    return response(500, { error: 'Failed to list todos' })
  }
}

/**
 * GET /api/todos/:id
 * 获取单个todo
 */
export const getHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const todoId = event.pathParameters?.id

    if (!todoId) {
      return response(400, { error: 'Todo ID is required' })
    }

    const todo = await getTodoById(userId, todoId)
    
    if (!todo) {
      return response(404, { error: 'Todo not found' })
    }

    return response(200, todo)
  } catch (error) {
    console.error('Error getting todo:', error)
    return response(500, { error: 'Failed to get todo' })
  }
}

/**
 * POST /api/todos
 * 创建新的todo
 */
export const createHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const body = JSON.parse(event.body || '{}')

    // 验证输入
    const result = CreateTodoSchema.safeParse(body)
    if (!result.success) {
      return response(400, { 
        error: 'Validation failed', 
        details: result.error.flatten() 
      })
    }

    const todo = await createTodo(userId, result.data)
    return response(201, todo)
  } catch (error) {
    console.error('Error creating todo:', error)
    return response(500, { error: 'Failed to create todo' })
  }
}

/**
 * PUT /api/todos/:id
 * 更新todo
 */
export const updateHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const todoId = event.pathParameters?.id
    const body = JSON.parse(event.body || '{}')

    if (!todoId) {
      return response(400, { error: 'Todo ID is required' })
    }

    // 验证输入
    const result = UpdateTodoSchema.safeParse(body)
    if (!result.success) {
      return response(400, { 
        error: 'Validation failed', 
        details: result.error.flatten() 
      })
    }

    const todo = await updateTodo(userId, todoId, result.data)
    
    if (!todo) {
      return response(404, { error: 'Todo not found' })
    }

    return response(200, todo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return response(500, { error: 'Failed to update todo' })
  }
}

/**
 * DELETE /api/todos/:id
 * 删除todo
 */
export const deleteHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserId(event)
    const todoId = event.pathParameters?.id

    if (!todoId) {
      return response(400, { error: 'Todo ID is required' })
    }

    const deleted = await deleteTodo(userId, todoId)
    
    if (!deleted) {
      return response(404, { error: 'Todo not found' })
    }

    return response(204, null)
  } catch (error) {
    console.error('Error deleting todo:', error)
    return response(500, { error: 'Failed to delete todo' })
  }
}
