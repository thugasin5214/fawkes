import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTodo,
  updateTodo,
  toggleTodoComplete,
} from "../../src/domain/todo";
import { TodoRepository } from "../../src/data/todo-repository";

// Mock repository
vi.mock("../../src/data/todo-repository", () => ({
  TodoRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    findByUserId: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Todo Domain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTodo", () => {
    it("should create a todo with valid input", async () => {
      const input = { title: "Test todo" };
      const userId = "user-123";

      const result = await createTodo(userId, input);

      expect(result).toMatchObject({
        title: "Test todo",
        userId: "user-123",
        completed: false,
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(TodoRepository.create).toHaveBeenCalledWith(result);
    });

    it("should trim whitespace from title", async () => {
      const input = { title: "  Test todo  " };
      const userId = "user-123";

      const result = await createTodo(userId, input);

      expect(result.title).toBe("Test todo");
    });

    it("should handle description", async () => {
      const input = {
        title: "Test todo",
        description: "This is a description",
      };
      const userId = "user-123";

      const result = await createTodo(userId, input);

      expect(result.description).toBe("This is a description");
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo", async () => {
      const existingTodo = {
        id: "todo-123",
        title: "Original title",
        completed: false,
        userId: "user-123",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(TodoRepository.findById).mockResolvedValue(existingTodo);

      const result = await updateTodo("user-123", "todo-123", {
        title: "Updated title",
      });

      expect(result?.title).toBe("Updated title");
      expect(result?.updatedAt).not.toBe(existingTodo.updatedAt);
    });

    it("should return null if todo not found", async () => {
      vi.mocked(TodoRepository.findById).mockResolvedValue(null);

      const result = await updateTodo("user-123", "invalid-id", {
        title: "Updated title",
      });

      expect(result).toBeNull();
    });

    it("should set completedAt when marking as complete", async () => {
      const existingTodo = {
        id: "todo-123",
        title: "Test",
        completed: false,
        userId: "user-123",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(TodoRepository.findById).mockResolvedValue(existingTodo);

      const result = await updateTodo("user-123", "todo-123", {
        completed: true,
      });

      expect(result?.completed).toBe(true);
      expect(result?.completedAt).toBeDefined();
    });
  });

  describe("toggleTodoComplete", () => {
    it("should toggle from incomplete to complete", async () => {
      const existingTodo = {
        id: "todo-123",
        title: "Test",
        completed: false,
        userId: "user-123",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(TodoRepository.findById).mockResolvedValue(existingTodo);

      const result = await toggleTodoComplete("user-123", "todo-123");

      expect(result?.completed).toBe(true);
    });
  });
});
