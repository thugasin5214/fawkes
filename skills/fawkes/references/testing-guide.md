# Testing Guide

测试是agent友好开发的关键。测试让agent的修改可验证。

## 测试金字塔

```
         /\
        /  \     E2E (5-10个关键路径)
       /----\    
      /      \   Integration (API + DB)
     /--------\  
    /          \ Unit (所有domain逻辑)
   --------------
```

## 1. 单元测试

### 工具选择
- **Framework**: Vitest (快，与Vite兼容)
- **Assertion**: Vitest内置
- **Mock**: vi.mock()

### 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'test/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Domain逻辑测试

```typescript
// services/backend/test/unit/todo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTodo, completeTodo, deleteTodo } from '@/domain/todo'
import { TodoRepository } from '@/data/todo-repository'

// Mock repository
vi.mock('@/data/todo-repository')

describe('Todo Domain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTodo', () => {
    it('should create todo with valid input', async () => {
      const input = {
        title: 'Buy milk',
        userId: 'user-1'
      }

      const result = await createTodo(input)

      expect(result).toMatchObject({
        title: 'Buy milk',
        userId: 'user-1',
        completed: false
      })
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
    })

    it('should reject empty title', async () => {
      const input = { title: '', userId: 'user-1' }

      await expect(createTodo(input)).rejects.toThrow('Title is required')
    })

    it('should trim whitespace from title', async () => {
      const input = { title: '  Buy milk  ', userId: 'user-1' }

      const result = await createTodo(input)

      expect(result.title).toBe('Buy milk')
    })
  })

  describe('completeTodo', () => {
    it('should mark todo as completed', async () => {
      const mockTodo = {
        id: 'todo-1',
        title: 'Test',
        completed: false
      }
      vi.mocked(TodoRepository.findById).mockResolvedValue(mockTodo)

      const result = await completeTodo('todo-1')

      expect(result.completed).toBe(true)
      expect(result.completedAt).toBeDefined()
    })

    it('should throw if todo not found', async () => {
      vi.mocked(TodoRepository.findById).mockResolvedValue(null)

      await expect(completeTodo('invalid-id')).rejects.toThrow('Todo not found')
    })
  })
})
```

### Schema测试

```typescript
// packages/schemas/test/todo.test.ts
import { describe, it, expect } from 'vitest'
import { TodoSchema, CreateTodoSchema } from '../src/todo'

describe('Todo Schema', () => {
  describe('TodoSchema', () => {
    it('should validate correct todo', () => {
      const todo = {
        id: 'uuid-1234',
        title: 'Test todo',
        completed: false,
        userId: 'user-1',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const result = TodoSchema.safeParse(todo)
      expect(result.success).toBe(true)
    })

    it('should reject invalid uuid', () => {
      const todo = {
        id: 'not-a-uuid',
        title: 'Test',
        completed: false
      }

      const result = TodoSchema.safeParse(todo)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateTodoSchema', () => {
    it('should require title', () => {
      const input = { title: '' }

      const result = CreateTodoSchema.safeParse(input)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('required')
    })

    it('should enforce max length', () => {
      const input = { title: 'a'.repeat(201) }

      const result = CreateTodoSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})
```

### React组件测试

```typescript
// apps/web/src/features/todo/__tests__/TodoList.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TodoList } from '../components/TodoList'

// 创建测试用的QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('TodoList', () => {
  it('should show loading state', () => {
    render(<TodoList />, { wrapper })
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('should show empty state when no todos', async () => {
    // Mock empty response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] })
    } as Response)

    render(<TodoList />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('No todos yet')).toBeInTheDocument()
    })
  })

  it('should render todo items', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: '1', title: 'Todo 1', completed: false },
          { id: '2', title: 'Todo 2', completed: true }
        ]
      })
    } as Response)

    render(<TodoList />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Todo 2')).toBeInTheDocument()
    })
  })

  it('should call onComplete when checkbox clicked', async () => {
    const user = userEvent.setup()
    // ... setup mock and render

    await user.click(screen.getByRole('checkbox', { name: /Todo 1/i }))

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1/complete'),
      expect.any(Object)
    )
  })
})
```

---

## 2. 集成测试

### API Handler测试

```typescript
// services/backend/test/integration/todo-handler.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { handler } from '@/handlers/todo'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// 使用DynamoDB Local
const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'local',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  }
})

describe('Todo Handler Integration', () => {
  beforeAll(async () => {
    // Setup test table
  })

  afterAll(async () => {
    // Cleanup
  })

  it('POST /todos should create a todo', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/todos',
      body: JSON.stringify({ title: 'Test todo' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token'
      }
    }

    const result = await handler(event as any, {} as any, () => {})

    expect(result.statusCode).toBe(201)
    const body = JSON.parse(result.body)
    expect(body.title).toBe('Test todo')
    expect(body.id).toBeDefined()
  })

  it('GET /todos should return list', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/todos',
      headers: {
        Authorization: 'Bearer test-token'
      }
    }

    const result = await handler(event as any, {} as any, () => {})

    expect(result.statusCode).toBe(200)
    const body = JSON.parse(result.body)
    expect(Array.isArray(body.data)).toBe(true)
  })
})
```

---

## 3. E2E测试 (Playwright)

### 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/web',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'pnpm dev:web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

### 关键路径测试

```typescript
// e2e/web/todo-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Todo Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login or setup auth
    await page.goto('/')
  })

  test('complete todo CRUD flow', async ({ page }) => {
    // 1. Navigate to todos
    await page.click('[data-testid="nav-todos"]')
    await expect(page).toHaveURL('/todos')

    // 2. Create new todo
    await page.click('[data-testid="create-todo-button"]')
    await page.fill('[data-testid="todo-title-input"]', 'E2E Test Todo')
    await page.click('[data-testid="submit-button"]')

    // 3. Verify created
    await expect(page.locator('text=E2E Test Todo')).toBeVisible()

    // 4. Complete todo
    await page.click('[data-testid="todo-checkbox-E2E Test Todo"]')
    await expect(
      page.locator('[data-testid="todo-item-E2E Test Todo"]')
    ).toHaveClass(/completed/)

    // 5. Delete todo
    await page.click('[data-testid="todo-menu-E2E Test Todo"]')
    await page.click('text=Delete')
    await page.click('[data-testid="confirm-delete"]')

    // 6. Verify deleted
    await expect(page.locator('text=E2E Test Todo')).not.toBeVisible()
  })

  test('shows empty state', async ({ page }) => {
    await page.goto('/todos')
    // Assuming fresh user with no todos
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
    await expect(page.locator('text=No todos yet')).toBeVisible()
  })

  test('handles error gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/todos', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      })
    })

    await page.goto('/todos')
    await expect(page.locator('[data-testid="error-state"]')).toBeVisible()
    await expect(page.locator('text=Something went wrong')).toBeVisible()
  })
})
```

### 视觉回归测试

```typescript
// e2e/web/visual.spec.ts
import { test, expect } from '@playwright/test'

test('todo list visual regression', async ({ page }) => {
  await page.goto('/todos')
  
  // 等待数据加载完成
  await page.waitForSelector('[data-testid="todo-list"]')
  
  // 截图对比
  await expect(page).toHaveScreenshot('todo-list.png', {
    maxDiffPixels: 100
  })
})
```

---

## 4. 测试命令

```bash
# 运行所有测试
pnpm test

# 只运行单元测试
pnpm test:unit

# 运行集成测试（需要DynamoDB Local）
pnpm test:integration

# 运行E2E测试
pnpm test:e2e

# 运行E2E测试（带UI）
pnpm test:e2e:ui

# 生成覆盖率报告
pnpm test:coverage

# 运行特定文件
pnpm test todo.test.ts

# Watch模式
pnpm test:watch
```

---

## 5. CI配置

```yaml
# .github/workflows/test.yml
name: Test

on:
  pull_request:
    branches: [main]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:unit

  integration-test:
    runs-on: ubuntu-latest
    services:
      dynamodb:
        image: amazon/dynamodb-local
        ports:
          - 8000:8000
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:integration
        env:
          DYNAMODB_ENDPOINT: http://localhost:8000

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm build:web
      - run: pnpm test:e2e
```

---

## 6. 测试最佳实践

### DO ✅

- 每个domain函数都有单元测试
- 关键用户流程有E2E测试
- 使用data-testid定位元素
- Mock外部依赖
- 测试边界情况和错误处理

### DON'T ❌

- 测试实现细节
- 测试第三方库
- 写脆弱的选择器
- 跳过loading/error状态测试
- 依赖测试顺序
