# Fawkes

> 一套 Agent 友好的全栈产品开发框架

🚀 **快速迭代** · 🤖 **Agent友好** · 📱 **跨平台** · ☁️ **AWS原生** · 🏭 **生产级**

---

## 📖 文档导航

| 文档 | 说明 | 适合谁 |
|------|------|--------|
| **[RUNBOOK.md](docs/runbook/RUNBOOK.md)** | 完整技术栈规范 | 所有人必读 |
| **[QUICK_START.md](docs/runbook/QUICK_START.md)** | 30分钟快速搭建 | 新项目起步 |
| **[AGENT_INTERACTION.md](docs/runbook/AGENT_INTERACTION.md)** | Agent协作最佳实践 | 使用AI开发 |
| **[DOCKER.md](docs/runbook/DOCKER.md)** | Docker容器化开发 | 本地测试/部署 |
| **[UI_DEVELOPMENT.md](docs/runbook/UI_DEVELOPMENT.md)** | UI开发工作流 | 前端开发 |
| **[SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md)** | Claude Code Skills推荐 | 扩展能力 |

---

## 这是什么？

Fawkes 是一套完整的技术栈规范和工具集，让你可以：

- 用 **Claude Code** 或其他 AI Agent 快速开发产品
- 一套代码同时运行在 **Web、iOS、Android**
- 部署到 **AWS** 的 Serverless 架构
- **本地开发** 和 **生产环境** 体验一致

## 技术栈

| 层级 | 技术 |
|------|------|
| Web | Next.js 14 + TypeScript |
| Mobile | Expo (React Native) |
| 共享UI | NativeWind + shadcn/ui |
| 后端 | AWS Lambda + API Gateway |
| 数据库 | DynamoDB / Aurora Serverless |
| 基础设施 | AWS CDK |
| Monorepo | pnpm + Turborepo |

## 快速开始

### 1. 克隆并安装

```bash
git clone <repo>
cd fawkes
pnpm install
```

### 2. 启动开发

```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm dev:web      # Web应用
pnpm dev:mobile   # Mobile应用
pnpm dev:backend  # 后端API
```

### 3. 验证

```bash
pnpm lint         # 代码检查
pnpm test         # 运行测试
pnpm build        # 构建
```

## 目录结构

```
fawkes/
├── apps/
│   ├── web/          # Next.js Web应用
│   └── mobile/       # Expo Mobile应用
├── packages/
│   ├── ui/           # 跨平台共享UI组件
│   ├── schemas/      # Zod Schema (API契约)
│   ├── api-client/   # 类型安全的API客户端
│   └── config/       # 共享配置
├── services/
│   └── backend/      # AWS Lambda业务逻辑
├── infra/
│   └── cdk/          # AWS CDK基础设施
├── docs/
│   ├── runbook/      # 操作手册
│   └── specs/        # 功能规格
└── skills/           # Claude Code Skills
```

## 文档

| 文档 | 说明 |
|------|------|
| [RUNBOOK.md](docs/runbook/RUNBOOK.md) | 完整的开发规范 |
| [QUICK_START.md](docs/runbook/QUICK_START.md) | 快速搭建指南 |
| [AGENT_INTERACTION.md](docs/runbook/AGENT_INTERACTION.md) | Agent交互最佳实践 |
| [Feature Spec模板](skills/fawkes/references/feature-spec-template.md) | 功能规格模板 |
| [UI Patterns](skills/fawkes/references/ui-patterns.md) | UI模式参考 |
| [Testing Guide](skills/fawkes/references/testing-guide.md) | 测试指南 |

## 与Agent协作

### 核心原则

1. **Spec First** - 先写规格文档，再让Agent实现
2. **小步快跑** - 每次只做一件事，验证后再继续
3. **验证驱动** - 所有修改必须通过验证命令

### 示例：让Agent创建新功能

```markdown
## 任务：创建评论功能

**Spec**: 请先阅读 `docs/specs/comment-spec.md`

**步骤**:
1. 在 `packages/schemas/` 创建 Schema
2. 在 `services/backend/` 实现业务逻辑
3. 在 `apps/web/` 实现前端

**验证**: `pnpm lint && pnpm test && pnpm build`
```

详见 [Agent交互指南](docs/runbook/AGENT_INTERACTION.md)

## 常用命令

```bash
# 开发
pnpm dev              # 启动所有服务
pnpm dev:web          # 只启动Web

# 验证
pnpm lint             # ESLint
pnpm test             # 测试
pnpm build            # 构建

# Docker
pnpm docker:build     # 构建Docker镜像
pnpm docker:up        # 启动容器
pnpm docker:dev       # 开发模式（热重载）

# 部署
pnpm cdk:deploy:dev   # 部署到dev环境
pnpm release:staging  # 发布到staging
```

完整命令列表见 [package.json](package.json)

## 自定义Skill

项目包含一个 Claude Code Skill，位于 `skills/fawkes/`：

```
skills/fawkes/
├── SKILL.md                    # Skill主文件
└── references/
    ├── feature-spec-template.md  # 功能规格模板
    ├── ui-patterns.md           # UI模式参考
    └── testing-guide.md         # 测试指南
```

你可以将此Skill导入到Claude Code中使用。

## License

MIT
