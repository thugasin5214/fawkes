# Fawkes - 完整资源索引

> 一站式查找所有文档、配置、示例

---

## 📚 文档

### 核心文档
| 文件 | 说明 |
|------|------|
| [docs/runbook/RUNBOOK.md](docs/runbook/RUNBOOK.md) | **主文档** - 技术栈、目录结构、命令规范 |
| [docs/runbook/QUICK_START.md](docs/runbook/QUICK_START.md) | 30分钟快速搭建指南 |
| [docs/runbook/AGENT_INTERACTION.md](docs/runbook/AGENT_INTERACTION.md) | Agent协作最佳实践 |
| [docs/runbook/DOCKER.md](docs/runbook/DOCKER.md) | Docker容器化开发指南 |
| [docs/runbook/UI_DEVELOPMENT.md](docs/runbook/UI_DEVELOPMENT.md) | UI开发工作流（v0.dev + Storybook） |
| [docs/runbook/UI_DEVELOPMENT_CONFIG.md](docs/runbook/UI_DEVELOPMENT_CONFIG.md) | UI开发具体配置 |

### 参考资料
| 文件 | 说明 |
|------|------|
| [docs/SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md) | Claude Code Skills使用指南 |
| [docs/specs/todo-feature-spec.md](docs/specs/todo-feature-spec.md) | Feature Spec示例（Todo） |

---

## 🛠️ Skills (Claude Code)

### 自定义Skill
| 文件 | 说明 |
|------|------|
| [skills/fawkes/SKILL.md](skills/fawkes/SKILL.md) | Fawkes主Skill |
| [skills/fawkes/references/feature-spec-template.md](skills/fawkes/references/feature-spec-template.md) | Feature Spec模板 |
| [skills/fawkes/references/ui-patterns.md](skills/fawkes/references/ui-patterns.md) | UI模式参考 |
| [skills/fawkes/references/testing-guide.md](skills/fawkes/references/testing-guide.md) | 测试指南 |

### 推荐的外部Skills
```bash
# Vercel Labs Skills（推荐）
npx add-skill vercel-labs/agent-skills

# 包含:
# - react-best-practices (57条规则)
# - web-design-guidelines (100+条规则)
# - vercel-deploy-claimable (一键部署)
```

---

## 📦 代码结构

### 前端
```
apps/
├── web/                    # Next.js Web应用
│   └── src/
│       ├── app/            # App Router页面
│       ├── components/     # 组件
│       ├── features/       # 功能模块
│       └── lib/            # 工具函数
│
└── mobile/                 # Expo React Native应用
    └── src/
        ├── app/            # Expo Router页面
        ├── components/     # 组件
        ├── features/       # 功能模块
        └── lib/            # 工具函数
```

### 共享包
```
packages/
├── ui/                     # 跨平台UI组件
│   └── src/
│       ├── primitives/     # 基础组件 (Button, Input等)
│       └── lib/            # 工具函数
│
├── schemas/                # Zod Schemas (API契约)
│   └── src/
│       ├── user.ts         # 用户相关
│       └── todo.ts         # Todo示例
│
├── api-client/             # 类型安全API客户端
└── config/                 # 共享配置
```

### 后端
```
services/
└── backend/
    ├── src/
    │   ├── handlers/       # Lambda入口（薄层）
    │   ├── domain/         # 业务逻辑（厚层，可测试）
    │   ├── data/           # 数据访问（Repository）
    │   └── lib/            # 工具函数
    └── test/
        ├── unit/           # 单元测试
        └── integration/    # 集成测试
```

### 基础设施
```
infra/
└── cdk/
    ├── lib/
    │   └── api-stack.ts    # API Stack定义
    └── bin/
        └── app.ts          # CDK入口
```

---

## ⚙️ 配置文件

| 文件 | 说明 |
|------|------|
| [package.json](package.json) | 根配置，所有命令定义 |
| [pnpm-workspace.yaml](pnpm-workspace.yaml) | Monorepo工作区 |
| [turbo.json](turbo.json) | Turborepo配置 |
| [docker-compose.yml](docker-compose.yml) | Docker服务定义 |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | CI/CD配置 |

---

## 🚀 快速命令

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev              # 启动所有
pnpm dev:web          # 只启动Web
pnpm dev:mobile       # 只启动Mobile
pnpm storybook        # 启动Storybook

# 验证
pnpm lint             # ESLint
pnpm test             # 测试
pnpm build            # 构建

# Docker
pnpm docker:build     # 构建Docker镜像
pnpm docker:up        # 启动容器
pnpm docker:down      # 停止容器
pnpm docker:dev       # 开发模式（热重载）

# 部署
pnpm cdk:deploy:dev   # 部署到dev
pnpm cdk:deploy:staging
pnpm cdk:deploy:prod
```

---

## 🔗 外部资源

### 设计工具
- [v0.dev](https://v0.dev) - AI生成React UI
- [shadcn/ui](https://ui.shadcn.com) - 组件库
- [Tailwind CSS](https://tailwindcss.com) - 样式

### Agent Skills
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) - React最佳实践
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - MCP集成

### 文档
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev)
- [AWS CDK Docs](https://docs.aws.amazon.com/cdk)

---

## 📋 Checklist：新项目启动

- [ ] 阅读 [RUNBOOK.md](docs/runbook/RUNBOOK.md)
- [ ] 按 [QUICK_START.md](docs/runbook/QUICK_START.md) 初始化项目
- [ ] 安装 Vercel Agent Skills: `npx add-skill vercel-labs/agent-skills`
- [ ] 配置 Storybook
- [ ] 创建第一个Feature Spec
- [ ] 设置CI/CD

---

## 📋 Checklist：开发新功能

- [ ] 创建 `spec.md` (参考模板)
- [ ] 定义 Schema (`packages/schemas`)
- [ ] 实现 Domain逻辑 (`services/backend/src/domain`)
- [ ] 创建 API Handler (`services/backend/src/handlers`)
- [ ] 实现前端 (`apps/web/src/features`)
- [ ] 添加测试
- [ ] 验证: `pnpm lint && pnpm test && pnpm build`
