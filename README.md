# 🔥 Fawkes

> Agent-friendly full-stack web app generator

🚀 **Fast Iteration** · 🤖 **Agent-Friendly** · 📱 **Cross-Platform** · ☁️ **AWS Native** · 🏭 **Production-Ready**

---

## 📖 Documentation

| Doc                                                           | Description              | Audience              |
| ------------------------------------------------------------- | ------------------------ | --------------------- |
| **[RUNBOOK.md](docs/runbook/RUNBOOK.md)**                     | Complete tech stack spec | Everyone              |
| **[QUICK_START.md](docs/runbook/QUICK_START.md)**             | 30-minute setup guide    | New projects          |
| **[AGENT_INTERACTION.md](docs/runbook/AGENT_INTERACTION.md)** | AI agent best practices  | AI-assisted dev       |
| **[DOCKER.md](docs/runbook/DOCKER.md)**                       | Docker containerization  | Local testing/deploy  |
| **[UI_DEVELOPMENT.md](docs/runbook/UI_DEVELOPMENT.md)**       | UI development workflow  | Frontend              |
| **[SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md)**                   | Claude Code Skills       | Extended capabilities |

---

## What is Fawkes?

Fawkes is a complete tech stack and toolset that enables you to:

- Build products rapidly with **Claude Code** or other AI agents
- Run one codebase on **Web, iOS, and Android**
- Deploy to **AWS** serverless architecture
- Have consistent **local development** and **production** experiences

Named after Dumbledore's phoenix — reborn from ashes, creates new apps from nothing.

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Web            | Next.js 14 + TypeScript      |
| Mobile         | Expo (React Native)          |
| Shared UI      | NativeWind + shadcn/ui       |
| Backend        | AWS Lambda + API Gateway     |
| Database       | DynamoDB / Aurora Serverless |
| Infrastructure | AWS CDK                      |
| Monorepo       | pnpm + Turborepo             |

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/thugasin5214/fawkes.git
cd fawkes
pnpm install
```

### 2. Start Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm dev:web      # Web app
pnpm dev:mobile   # Mobile app
pnpm dev:backend  # Backend API
```

### 3. Verify

```bash
pnpm lint         # Code linting
pnpm test         # Run tests
pnpm build        # Build
```

## Project Structure

```
fawkes/
├── apps/
│   ├── web/          # Next.js web app
│   └── mobile/       # Expo mobile app
├── packages/
│   ├── ui/           # Cross-platform shared UI
│   ├── schemas/      # Zod schemas (API contracts)
│   ├── api-client/   # Type-safe API client
│   └── config/       # Shared configuration
├── services/
│   └── backend/      # AWS Lambda business logic
├── infra/
│   └── cdk/          # AWS CDK infrastructure
├── docs/
│   ├── runbook/      # Operation guides
│   └── specs/        # Feature specifications
└── skills/           # Claude Code Skills
```

## Docker

```bash
# Production build
pnpm docker:build
pnpm docker:up

# Development with hot reload
pnpm docker:dev

# With LocalStack (AWS emulation)
pnpm docker:local-aws
```

## Working with AI Agents

### Core Principles

1. **Spec First** — Write specifications before implementation
2. **Small Steps** — Do one thing at a time, verify, then continue
3. **Validation Driven** — All changes must pass validation commands

### Example: Create a New Feature

```markdown
## Task: Create comments feature

**Spec**: Read `docs/specs/comment-spec.md` first

**Steps**:

1. Create Schema in `packages/schemas/`
2. Implement logic in `services/backend/`
3. Build frontend in `apps/web/`

**Verify**: `pnpm lint && pnpm test && pnpm build`
```

See [Agent Interaction Guide](docs/runbook/AGENT_INTERACTION.md) for details.

## Common Commands

```bash
# Development
pnpm dev              # Start all services
pnpm dev:web          # Web only

# Validation
pnpm lint             # ESLint
pnpm test             # Tests
pnpm build            # Build

# Docker
pnpm docker:build     # Build Docker image
pnpm docker:up        # Start container
pnpm docker:dev       # Dev mode (hot reload)

# Deployment
pnpm cdk:deploy:dev   # Deploy to dev
pnpm release:staging  # Release to staging
```

See [package.json](package.json) for full command list.

## Custom Skill

This project includes a Claude Code Skill at `skills/fawkes/`:

```
skills/fawkes/
├── SKILL.md                      # Main skill file
└── references/
    ├── feature-spec-template.md  # Feature spec template
    ├── ui-patterns.md            # UI pattern reference
    └── testing-guide.md          # Testing guide
```

Import this skill into Claude Code to use it.

## License

MIT

---

[中文文档](README.zh.md)
