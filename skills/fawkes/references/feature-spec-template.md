# Feature: [Feature Name]

> 填写说明：将 `[bracketed text]` 替换为实际内容

## 1. 概述

### 目的
[这个功能解决什么问题？用一句话描述]

### 用户故事
```
作为 [角色]
我想要 [功能]
以便 [价值/好处]
```

### 范围
- ✅ 包含：[列出包含的内容]
- ❌ 不包含：[列出明确不包含的内容]

---

## 2. 数据模型

### 主要实体

```typescript
// packages/schemas/src/[feature].ts
import { z } from 'zod'

export const [Feature]Schema = z.object({
  id: z.string().uuid(),
  // 添加其他字段
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type [Feature] = z.infer<typeof [Feature]Schema>
```

### 关联关系
- [描述与其他实体的关系]

---

## 3. API契约

### Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/[feature]` | 获取列表 | Required |
| GET | `/api/[feature]/:id` | 获取详情 | Required |
| POST | `/api/[feature]` | 创建 | Required |
| PUT | `/api/[feature]/:id` | 更新 | Required |
| DELETE | `/api/[feature]/:id` | 删除 | Required |

### Request/Response Examples

#### GET /api/[feature]

Request:
```http
GET /api/[feature]?page=1&limit=20
Authorization: Bearer <token>
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### POST /api/[feature]

Request:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

Response:
```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 4. UI规格

### 页面结构

```
/[feature]              → 列表页
/[feature]/new          → 创建页
/[feature]/[id]         → 详情页
/[feature]/[id]/edit    → 编辑页
```

### 状态定义

| 状态 | 触发条件 | UI表现 |
|------|---------|--------|
| Loading | 数据加载中 | Skeleton/Spinner |
| Empty | data.length === 0 | 空状态插图 + CTA |
| Error | API返回错误 | 错误提示 + 重试按钮 |
| Success | 数据正常返回 | 正常列表/内容 |

### 组件树（列表页示例）

```
[Feature]ListPage
├── Header
│   ├── Title
│   └── CreateButton
├── FilterBar (optional)
│   ├── SearchInput
│   └── FilterDropdown
├── Content
│   ├── LoadingSkeleton (when loading)
│   ├── EmptyState (when empty)
│   ├── ErrorState (when error)
│   └── [Feature]List (when success)
│       └── [Feature]ListItem (×N)
└── Pagination
```

### 交互规则

1. **列表页**
   - 点击列表项 → 跳转详情页
   - 点击创建按钮 → 跳转创建页
   - 支持下拉刷新（Mobile）
   - 支持无限滚动或分页

2. **表单页**
   - 表单验证：实时 + 提交时
   - 提交中：按钮显示loading，禁用交互
   - 成功：Toast提示 + 跳转
   - 失败：Toast提示，保留表单数据

3. **删除操作**
   - 必须二次确认（Confirm Dialog）
   - 成功后刷新列表或移除该项

---

## 5. 业务规则

### 验证规则
- [字段1]：[验证规则描述]
- [字段2]：[验证规则描述]

### 权限规则
- [描述谁可以执行什么操作]

### 业务逻辑
1. [描述核心业务逻辑1]
2. [描述核心业务逻辑2]

---

## 6. 验收标准

### 功能验收
- [ ] 用户可以查看[feature]列表
- [ ] 用户可以创建新的[feature]
- [ ] 用户可以编辑现有[feature]
- [ ] 用户可以删除[feature]
- [ ] 所有状态（loading/empty/error/success）正常显示

### 技术验收
- [ ] Schema定义在 `packages/schemas`
- [ ] API Handler在 `services/backend/src/handlers`
- [ ] Domain逻辑在 `services/backend/src/domain`
- [ ] 单元测试覆盖核心逻辑
- [ ] `pnpm lint` 通过
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过

### E2E验收（如需要）
- [ ] 冒烟测试：创建→查看→编辑→删除 完整流程

---

## 7. 技术Notes

### 依赖
- [列出需要添加的npm包]

### 数据库
- Table: `[feature]-table`
- Primary Key: `id`
- GSI: [如果需要]

### 注意事项
- [技术实现需要注意的点]

---

## 8. 时间线

| 阶段 | 任务 | 预估 |
|------|------|------|
| 1 | Schema + API | 2h |
| 2 | Backend逻辑 | 4h |
| 3 | Web UI | 6h |
| 4 | Mobile UI | 4h |
| 5 | 测试 | 2h |

---

## Changelog

| 日期 | 变更 | 作者 |
|------|------|------|
| YYYY-MM-DD | 初始版本 | [name] |
