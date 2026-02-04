# Feature: Todo List

> 这是一个示例Feature Spec，展示如何定义一个完整的功能模块

## 1. 概述

### 目的
让用户可以创建、管理和追踪待办事项，提高日常任务管理效率。

### 用户故事
```
作为 普通用户
我想要 创建和管理待办事项
以便 更好地组织我的日常任务
```

### 范围
- ✅ 包含：CRUD操作、完成状态、列表视图
- ❌ 不包含：标签、优先级、提醒、共享协作

---

## 2. 数据模型

### 主要实体

```typescript
// packages/schemas/src/todo.ts
import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  completed: z.boolean().default(false),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional()
})

export type Todo = z.infer<typeof TodoSchema>

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional()
})

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>

export const UpdateTodoSchema = CreateTodoSchema.partial()

export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>
```

### 关联关系
- Todo belongs to User (userId)

---

## 3. API契约

### Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/todos` | 获取当前用户的todo列表 | Required |
| GET | `/api/todos/:id` | 获取单个todo | Required |
| POST | `/api/todos` | 创建新todo | Required |
| PUT | `/api/todos/:id` | 更新todo | Required |
| DELETE | `/api/todos/:id` | 删除todo | Required |
| POST | `/api/todos/:id/complete` | 标记完成 | Required |
| POST | `/api/todos/:id/uncomplete` | 取消完成 | Required |

### Request/Response Examples

#### GET /api/todos

Response:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "userId": "user-123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

#### POST /api/todos

Request:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "userId": "user-123",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## 4. UI规格

### 页面结构

```
/todos              → 列表页（主页面）
```

### 状态定义

| 状态 | 触发条件 | UI表现 |
|------|---------|--------|
| Loading | 初始加载或刷新 | 3个骨架卡片 |
| Empty | data.length === 0 | 空状态插图 + "Add your first todo" 按钮 |
| Error | API返回错误 | 错误提示 + 重试按钮 |
| Success | 数据正常返回 | Todo列表 |

### 组件树

```
TodoPage
├── Header
│   ├── Title "My Todos"
│   └── AddButton (opens modal)
├── TodoList
│   ├── LoadingSkeleton (when loading)
│   ├── EmptyState (when empty)
│   ├── ErrorState (when error)
│   └── TodoItem (×N, when success)
│       ├── Checkbox (toggle complete)
│       ├── Title
│       ├── Description (truncated)
│       └── Actions
│           ├── EditButton (opens modal)
│           └── DeleteButton (confirm dialog)
└── AddTodoModal / EditTodoModal
    ├── TitleInput
    ├── DescriptionTextarea
    ├── CancelButton
    └── SaveButton
```

### 交互规则

1. **添加Todo**
   - 点击 "Add" 按钮 → 打开Modal
   - 填写Title（必填）、Description（可选）
   - 点击Save → 关闭Modal，刷新列表，显示success toast
   - 点击Cancel → 关闭Modal，丢弃输入

2. **完成/取消完成**
   - 点击Checkbox → 立即切换状态（乐观更新）
   - 如果API失败 → 回滚状态，显示error toast

3. **编辑Todo**
   - 点击Edit → 打开Modal，预填充当前数据
   - 保存逻辑同添加

4. **删除Todo**
   - 点击Delete → 显示确认对话框
   - 确认 → 删除，刷新列表，显示success toast
   - 取消 → 关闭对话框

---

## 5. 业务规则

### 验证规则
- title：必填，1-200字符
- description：可选，最多1000字符

### 权限规则
- 用户只能操作自己的todos

### 业务逻辑
1. 创建todo时，completed默认为false
2. 完成todo时，自动设置completedAt时间戳
3. 取消完成时，清空completedAt

---

## 6. 验收标准

### 功能验收
- [ ] 用户可以查看自己的todo列表
- [ ] 用户可以创建新的todo
- [ ] 用户可以编辑现有todo的title和description
- [ ] 用户可以删除todo（需确认）
- [ ] 用户可以标记todo为完成/未完成
- [ ] Loading状态显示骨架屏
- [ ] Empty状态显示引导创建
- [ ] Error状态显示错误信息和重试按钮

### 技术验收
- [ ] Schema定义在 `packages/schemas/src/todo.ts`
- [ ] API Handler在 `services/backend/src/handlers/todo.ts`
- [ ] Domain逻辑在 `services/backend/src/domain/todo.ts`
- [ ] Data层在 `services/backend/src/data/todo-repository.ts`
- [ ] Web组件在 `apps/web/src/features/todo/`
- [ ] 单元测试覆盖domain逻辑
- [ ] `pnpm lint` 通过
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过

### E2E验收
- [ ] 冒烟测试：创建→查看→完成→编辑→删除 完整流程

---

## 7. 技术Notes

### 依赖
- 无需额外npm包，使用现有stack

### 数据库
- Table: `todos`
- Primary Key: `PK=USER#userId`, `SK=TODO#todoId`
- GSI: none

### 注意事项
- 乐观更新toggle操作以提升体验
- Modal使用shadcn/ui Dialog组件

---

## 8. 时间线

| 阶段 | 任务 | 预估 |
|------|------|------|
| 1 | Schema定义 | 30min |
| 2 | Backend API | 2h |
| 3 | Data层 | 1h |
| 4 | Web UI | 3h |
| 5 | 测试 | 1h |
| **总计** | | **7.5h** |

---

## Changelog

| 日期 | 变更 | 作者 |
|------|------|------|
| 2024-01-01 | 初始版本 | Claude |
