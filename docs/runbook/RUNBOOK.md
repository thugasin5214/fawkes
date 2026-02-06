# Product Factory Runbook v1.0

> 这是一套跨平台、agent友好的全栈技术栈规范。
> 人和agent都必须遵循此文档来开发、测试、发布。

## 0. 核心原则

### R0: Repo是唯一真相

- 所有决策必须落到代码/文档
- Agent不允许"口头记忆"，只能从repo读规范再改代码

### R1: 强约定目录 + 强命令

- 所有验证动作都是CLI（人/agent同样跑）
- `pnpm lint/test/build`、`cdk synth/diff`必须一键跑通

### R2: 三环境

- `dev` - 本地/个人AWS
- `staging` - 团队共享
- `prod` - 线上

---

## 1. 技术栈总览

| 层级         | 技术选择                                     | 理由                         |
| ------------ | -------------------------------------------- | ---------------------------- |
| **Web**      | Next.js 14 (App Router) + TypeScript         | Agent训练数据多，SSR/SSG灵活 |
| **Mobile**   | Expo (React Native) + TypeScript             | 一套代码iOS/Android          |
| **共享UI**   | NativeWind + react-native-web                | Tailwind跨平台，轻量         |
| **组件库**   | shadcn/ui (Web) + 自定义primitives (Mobile)  | 可复制，非黑盒依赖           |
| **后端**     | AWS Lambda + API Gateway                     | Serverless，无运维           |
| **数据库**   | DynamoDB (轻应用) / Aurora Serverless (复杂) | 按需选择                     |
| **存储**     | S3                                           | 标准方案                     |
| **认证**     | Cognito / 自建JWT                            | 生产级                       |
| **IaC**      | AWS CDK (TypeScript)                         | Infra也是代码，agent友好     |
| **Monorepo** | pnpm + turborepo                             | 统一依赖，增量构建           |

---

## 2. 目录结构（必须严格遵循）

```
repo/
├── apps/
│   ├── web/                    # Next.js Web应用
│   │   ├── src/
│   │   │   ├── app/            # App Router页面
│   │   │   ├── components/     # Web专用组件
│   │   │   ├── features/       # 功能模块（按feature组织）
│   │   │   │   └── [feature]/
│   │   │   │       ├── spec.md       # 功能规格（agent输入）
│   │   │   │       ├── api.ts        # API调用
│   │   │   │       ├── hooks.ts      # React hooks
│   │   │   │       ├── components/   # 功能组件
│   │   │   │       └── __tests__/    # 单元测试
│   │   │   └── lib/            # 工具函数
│   │   ├── public/
│   │   └── package.json
│   │
│   └── mobile/                 # Expo React Native应用
│       ├── src/
│       │   ├── app/            # Expo Router页面
│       │   ├── components/     # Mobile专用组件
│       │   ├── features/       # 功能模块（与web对应）
│       │   └── lib/
│       ├── app.json
│       └── package.json
│
├── packages/
│   ├── ui/                     # 跨平台共享UI组件
│   │   ├── src/
│   │   │   ├── primitives/     # 基础组件（Button, Text, Input等）
│   │   │   ├── patterns/       # 交互模式（Form, List, Wizard等）
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── schemas/                # 契约中心（Zod schemas）
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/             # 统一API客户端（typed）
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── endpoints/
│   │   └── package.json
│   │
│   └── config/                 # 共享配置
│       ├── eslint/
│       ├── tsconfig/
│       └── tailwind/
│
├── services/
│   └── backend/                # Lambda业务逻辑
│       ├── src/
│       │   ├── handlers/       # Lambda入口（薄层）
│       │   ├── domain/         # 业务逻辑（可测试核心）
│       │   ├── data/           # DDB/S3访问封装
│       │   └── lib/
│       ├── test/
│       │   ├── unit/
│       │   └── integration/
│       └── package.json
│
├── infra/
│   └── cdk/                    # AWS CDK
│       ├── lib/
│       │   ├── api-stack.ts
│       │   ├── database-stack.ts
│       │   └── auth-stack.ts
│       ├── bin/
│       └── package.json
│
├── tools/
│   └── scripts/                # 自动化脚本
│       ├── release.sh
│       ├── codegen.sh
│       └── verify.sh
│
├── docs/
│   ├── runbook/                # 操作手册（本文件所在）
│   ├── adr/                    # 架构决策记录
│   └── specs/                  # 全局规格
│
├── e2e/                        # E2E测试
│   ├── web/                    # Playwright
│   └── api/                    # API集成测试
│
├── .github/workflows/          # CI/CD
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 3. 命令规范（人和agent必须使用）

### 3.1 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev                    # 启动所有
pnpm dev:web                # 只启动Web
pnpm dev:mobile             # 只启动Mobile
pnpm dev:backend            # 本地API

# 代码生成
pnpm codegen                # 生成API类型
```

### 3.2 验证命令（CI Gate）

```bash
# 代码质量
pnpm lint                   # ESLint检查
pnpm typecheck              # TypeScript检查
pnpm format:check           # Prettier检查

# 测试
pnpm test                   # 所有单元测试
pnpm test:unit              # 仅单元测试
pnpm test:integration       # 集成测试
pnpm test:e2e               # E2E测试

# 构建
pnpm build                  # 构建所有
pnpm build:web              # 构建Web
pnpm build:mobile           # 构建Mobile
pnpm build:backend          # 构建Backend
```

### 3.3 基础设施命令

```bash
# CDK
pnpm cdk:synth              # 生成CloudFormation
pnpm cdk:diff               # 查看变更
pnpm cdk:deploy:dev         # 部署到dev
pnpm cdk:deploy:staging     # 部署到staging
pnpm cdk:deploy:prod        # 部署到prod
```

### 3.4 发布命令

```bash
# Web发布
pnpm release:web:staging
pnpm release:web:prod

# Mobile发布
pnpm mobile:build:ios       # 构建iOS
pnpm mobile:build:android   # 构建Android
pnpm mobile:submit:ios      # 提交App Store
pnpm mobile:submit:android  # 提交Play Store

# 全量发布
pnpm release:staging
pnpm release:prod
```

---

## 4. Feature开发流程

### 4.1 新建Feature的标准流程

```bash
# 1. 创建feature目录
mkdir -p apps/web/src/features/[feature-name]
mkdir -p apps/mobile/src/features/[feature-name]

# 2. 创建spec文件（最重要！）
touch apps/web/src/features/[feature-name]/spec.md

# 3. 添加schema
touch packages/schemas/src/[feature-name].ts

# 4. 实现API
touch services/backend/src/handlers/[feature-name].ts
touch services/backend/src/domain/[feature-name].ts

# 5. 实现前端
touch apps/web/src/features/[feature-name]/api.ts
touch apps/web/src/features/[feature-name]/hooks.ts
touch apps/web/src/features/[feature-name]/components/index.tsx

# 6. 添加测试
touch apps/web/src/features/[feature-name]/__tests__/index.test.ts
touch services/backend/test/unit/[feature-name].test.ts

# 7. 验证
pnpm lint && pnpm test && pnpm build
```

### 4.2 Feature Spec模板（spec.md）

**这是agent最重要的输入文件！**

````markdown
# Feature: [Feature Name]

## 目的

[这个功能解决什么问题？]

## 用户故事

- 作为 [角色]，我想要 [功能]，以便 [价值]

## 数据模型

```typescript
interface FeatureData {
  id: string;
  // ...
}
```
````

## API契约

- `GET /api/[feature]` - 获取列表
- `POST /api/[feature]` - 创建
- `PUT /api/[feature]/:id` - 更新
- `DELETE /api/[feature]/:id` - 删除

## UI状态

- [ ] Loading - 加载中
- [ ] Empty - 空状态
- [ ] Error - 错误状态
- [ ] Success - 成功状态

## 交互规则

1. [点击某按钮时...]
2. [表单验证规则...]
3. [错误处理...]

## 验收标准

- [ ] 单元测试覆盖核心逻辑
- [ ] API集成测试通过
- [ ] Lint通过
- [ ] Build通过
- [ ] E2E冒烟测试通过（如适用）

````

---

## 5. UI与Agent交互规范

### 5.1 核心原则

> Agent只在"可验证的边界"里工作

Agent改完UI，你必须能立刻确认对不对，而不是凭感觉。

### 5.2 UI任务模板（给Agent的标准输入）

```markdown
## UI Task

**Scope**: apps/web/src/features/[feature]

**Spec**: apps/web/src/features/[feature]/spec.md

**Do**:
1. 先阅读spec.md
2. 按spec实现UI
3. 添加/更新Storybook stories
4. 如用户流程变更，更新E2E测试

**Verify** (必须全部通过):
```bash
pnpm lint
pnpm test
pnpm build:web
pnpm test:e2e  # 如适用
````

**Output**:

- 代码变更
- 填写验收checklist

````

### 5.3 UI组件开发规范

#### 共享组件（packages/ui）

```typescript
// packages/ui/src/primitives/Button.tsx
import { Pressable, Text, View } from 'react-native'
import { cn } from '../lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onPress: () => void
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPress,
  children
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        'rounded-lg items-center justify-center',
        // variant styles
        variant === 'primary' && 'bg-blue-600',
        variant === 'secondary' && 'bg-gray-200',
        variant === 'ghost' && 'bg-transparent',
        // size styles
        size === 'sm' && 'px-3 py-1.5',
        size === 'md' && 'px-4 py-2',
        size === 'lg' && 'px-6 py-3',
        // state styles
        disabled && 'opacity-50'
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={cn(
        'font-medium',
        variant === 'primary' && 'text-white',
        variant === 'secondary' && 'text-gray-900',
        variant === 'ghost' && 'text-blue-600'
      )}>
        {children}
      </Text>
    </Pressable>
  )
}
````

#### 交互模式（packages/ui/patterns）

每个交互模式必须定义：

1. **状态机** - idle/loading/success/error
2. **Props接口** - 类型安全
3. **可访问性** - aria labels, keyboard navigation

### 5.4 Storybook规范

每个组件必须有Story：

```typescript
// packages/ui/src/primitives/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost']
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

---

## 6. 测试规范

### 6.1 测试金字塔

```
         /\
        /  \     E2E (Playwright) - 关键路径
       /----\
      /      \   Integration - API + DB
     /--------\
    /          \ Unit - Domain逻辑
   --------------
```

### 6.2 单元测试

```typescript
// services/backend/test/unit/todo.test.ts
import { describe, it, expect } from "vitest";
import { createTodo, validateTodo } from "../../src/domain/todo";

describe("Todo Domain", () => {
  describe("createTodo", () => {
    it("should create a todo with valid input", () => {
      const input = { title: "Test", userId: "user-1" };
      const result = createTodo(input);

      expect(result.id).toBeDefined();
      expect(result.title).toBe("Test");
      expect(result.completed).toBe(false);
    });

    it("should throw on empty title", () => {
      const input = { title: "", userId: "user-1" };
      expect(() => createTodo(input)).toThrow("Title is required");
    });
  });
});
```

### 6.3 E2E测试（Playwright）

```typescript
// e2e/web/todo.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Todo Feature", () => {
  test("should create a new todo", async ({ page }) => {
    // 1. 导航到页面
    await page.goto("/todos");

    // 2. 填写表单
    await page.fill('[data-testid="todo-input"]', "Buy milk");
    await page.click('[data-testid="add-button"]');

    // 3. 验证结果
    await expect(page.locator('[data-testid="todo-item"]')).toContainText(
      "Buy milk",
    );
  });

  test("should show empty state", async ({ page }) => {
    await page.goto("/todos");
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });
});
```

---

## 7. 发布流程

### 7.1 发布前检查

```bash
# 必须全部通过才能发布
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm cdk:diff
```

### 7.2 Staging发布

```bash
# 1. 部署基础设施
pnpm cdk:deploy:staging

# 2. 部署Web
pnpm release:web:staging

# 3. 冒烟测试
pnpm test:e2e:staging
```

### 7.3 Production发布

```bash
# 1. 创建release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. 部署（CI自动执行）
# - cdk deploy prod
# - web deploy prod
# - mobile build & submit
```

---

## 8. 本地开发环境

### 8.1 必需工具

```bash
# Node.js (推荐使用nvm)
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@9

# AWS CLI
brew install awscli

# AWS CDK
npm install -g aws-cdk

# Expo CLI
npm install -g expo-cli
```

### 8.2 本地AWS模拟

```bash
# DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# 或使用LocalStack (完整AWS模拟)
docker run -p 4566:4566 localstack/localstack
```

### 8.3 环境变量

```bash
# .env.local (不提交到git)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://localhost:8000
```

---

## 9. 故障排查

### 9.1 常见问题

| 问题                | 解决方案                                          |
| ------------------- | ------------------------------------------------- |
| `pnpm install` 失败 | 删除 `node_modules` 和 `pnpm-lock.yaml`，重新安装 |
| TypeScript类型错误  | 运行 `pnpm typecheck` 查看详情                    |
| CDK部署失败         | 运行 `pnpm cdk:diff` 检查变更                     |
| Mobile构建失败      | 运行 `expo doctor` 诊断                           |

### 9.2 Agent调试

如果Agent执行失败：

1. 检查 `spec.md` 是否完整
2. 检查验证命令是否都通过
3. 查看错误日志，提取关键信息
4. 将错误信息喂回Agent进行修复

---

## 10. 版本记录

| 版本 | 日期    | 变更     |
| ---- | ------- | -------- |
| 1.0  | 2024-01 | 初始版本 |

---

**下一步**: 查看 `docs/runbook/QUICK_START.md` 快速开始
