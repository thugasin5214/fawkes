// User & Auth
export {
  UserSchema,
  type User,
  LoginRequestSchema,
  type LoginRequest,
  LoginResponseSchema,
  type LoginResponse,
  RegisterRequestSchema,
  type RegisterRequest,
} from "./user";

// Todo
export {
  TodoSchema,
  type Todo,
  CreateTodoSchema,
  type CreateTodoInput,
  UpdateTodoSchema,
  type UpdateTodoInput,
  TodoListResponseSchema,
  type TodoListResponse,
} from "./todo";

// Re-export zod for convenience
export { z } from "zod";
