import { v4 as uuidv4 } from "uuid";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@repo/schemas";
import { TodoRepository } from "../data/todo-repository";

/**
 * 创建新的Todo
 */
export async function createTodo(
  userId: string,
  input: CreateTodoInput,
): Promise<Todo> {
  const now = new Date().toISOString();

  const todo: Todo = {
    id: uuidv4(),
    title: input.title.trim(),
    description: input.description?.trim(),
    completed: false,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  await TodoRepository.create(todo);
  return todo;
}

/**
 * 获取用户的所有Todos
 */
export async function getTodos(userId: string): Promise<Todo[]> {
  return TodoRepository.findByUserId(userId);
}

/**
 * 根据ID获取单个Todo
 */
export async function getTodoById(
  userId: string,
  todoId: string,
): Promise<Todo | null> {
  const todo = await TodoRepository.findById(userId, todoId);
  return todo;
}

/**
 * 更新Todo
 */
export async function updateTodo(
  userId: string,
  todoId: string,
  input: UpdateTodoInput,
): Promise<Todo | null> {
  const existing = await TodoRepository.findById(userId, todoId);

  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();

  const updated: Todo = {
    ...existing,
    title: input.title?.trim() ?? existing.title,
    description: input.description?.trim() ?? existing.description,
    completed: input.completed ?? existing.completed,
    updatedAt: now,
    // 如果刚刚完成，记录完成时间
    completedAt:
      input.completed && !existing.completed ? now : existing.completedAt,
  };

  await TodoRepository.update(updated);
  return updated;
}

/**
 * 删除Todo
 */
export async function deleteTodo(
  userId: string,
  todoId: string,
): Promise<boolean> {
  const existing = await TodoRepository.findById(userId, todoId);

  if (!existing) {
    return false;
  }

  await TodoRepository.delete(userId, todoId);
  return true;
}

/**
 * 切换Todo完成状态
 */
export async function toggleTodoComplete(
  userId: string,
  todoId: string,
): Promise<Todo | null> {
  const existing = await TodoRepository.findById(userId, todoId);

  if (!existing) {
    return null;
  }

  return updateTodo(userId, todoId, { completed: !existing.completed });
}
