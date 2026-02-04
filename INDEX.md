# Fawkes - Complete Resource Index

> One-stop reference for all docs, configs, and examples

---

## 📚 Documentation

### Core Docs
| File | Description |
|------|-------------|
| [docs/runbook/RUNBOOK.md](docs/runbook/RUNBOOK.md) | **Main doc** - Tech stack, structure, commands |
| [docs/runbook/QUICK_START.md](docs/runbook/QUICK_START.md) | 30-minute quick setup guide |
| [docs/runbook/AGENT_INTERACTION.md](docs/runbook/AGENT_INTERACTION.md) | Agent collaboration best practices |
| [docs/runbook/DOCKER.md](docs/runbook/DOCKER.md) | Docker containerization guide |
| [docs/runbook/UI_DEVELOPMENT.md](docs/runbook/UI_DEVELOPMENT.md) | UI workflow (v0.dev + Storybook) |
| [docs/runbook/UI_DEVELOPMENT_CONFIG.md](docs/runbook/UI_DEVELOPMENT_CONFIG.md) | UI development configuration |

### References
| File | Description |
|------|-------------|
| [docs/SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md) | Claude Code Skills usage guide |
| [docs/specs/todo-feature-spec.md](docs/specs/todo-feature-spec.md) | Feature spec example (Todo) |

---

## 🛠️ Skills (Claude Code)

### Custom Skill
| File | Description |
|------|-------------|
| [skills/fawkes/SKILL.md](skills/fawkes/SKILL.md) | Fawkes main skill |
| [skills/fawkes/references/feature-spec-template.md](skills/fawkes/references/feature-spec-template.md) | Feature spec template |
| [skills/fawkes/references/ui-patterns.md](skills/fawkes/references/ui-patterns.md) | UI patterns reference |
| [skills/fawkes/references/testing-guide.md](skills/fawkes/references/testing-guide.md) | Testing guide |

### Recommended External Skills
```bash
# Vercel Labs Skills (recommended)
npx add-skill vercel-labs/agent-skills

# Includes:
# - react-best-practices (57 rules)
# - web-design-guidelines (100+ rules)
# - vercel-deploy-claimable (one-click deploy)
```

---

## 📦 Code Structure

### Frontend
```
apps/
├── web/                    # Next.js web app
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # Components
│       ├── features/       # Feature modules
│       └── lib/            # Utilities
│
└── mobile/                 # Expo React Native app
    └── src/
        ├── app/            # Expo Router pages
        ├── components/     # Components
        ├── features/       # Feature modules
        └── lib/            # Utilities
```

### Shared Packages
```
packages/
├── ui/                     # Cross-platform UI components
│   └── src/
│       ├── primitives/     # Base components (Button, Input, etc.)
│       └── lib/            # Utilities
│
├── schemas/                # Zod Schemas (API contracts)
│   └── src/
│       ├── user.ts         # User related
│       └── todo.ts         # Todo example
│
├── api-client/             # Type-safe API client
└── config/                 # Shared config
```

### Backend
```
services/
└── backend/
    ├── src/
    │   ├── handlers/       # Lambda entry points (thin layer)
    │   ├── domain/         # Business logic (thick layer, testable)
    │   ├── data/           # Data access (Repository)
    │   └── lib/            # Utilities
    └── test/
        ├── unit/           # Unit tests
        └── integration/    # Integration tests
```

### Infrastructure
```
infra/
└── cdk/
    ├── lib/
    │   └── api-stack.ts    # API Stack definition
    └── bin/
        └── app.ts          # CDK entry point
```

---

## ⚙️ Config Files

| File | Description |
|------|-------------|
| [package.json](package.json) | Root config, all commands |
| [pnpm-workspace.yaml](pnpm-workspace.yaml) | Monorepo workspace |
| [turbo.json](turbo.json) | Turborepo config |
| [docker-compose.yml](docker-compose.yml) | Docker service definitions |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | CI/CD config |

---

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Start all
pnpm dev:web          # Web only
pnpm dev:mobile       # Mobile only
pnpm storybook        # Start Storybook

# Validation
pnpm lint             # ESLint
pnpm test             # Tests
pnpm build            # Build

# Docker
pnpm docker:build     # Build Docker image
pnpm docker:up        # Start container
pnpm docker:down      # Stop container
pnpm docker:dev       # Dev mode (hot reload)

# Deployment
pnpm cdk:deploy:dev   # Deploy to dev
pnpm cdk:deploy:staging
pnpm cdk:deploy:prod
```

---

## 🔗 External Resources

### Design Tools
- [v0.dev](https://v0.dev) - AI-generated React UI
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Styling

### Agent Skills
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) - React best practices
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - MCP integration

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev)
- [AWS CDK Docs](https://docs.aws.amazon.com/cdk)

---

## 📋 Checklist: New Project Setup

- [ ] Read [RUNBOOK.md](docs/runbook/RUNBOOK.md)
- [ ] Follow [QUICK_START.md](docs/runbook/QUICK_START.md) to initialize
- [ ] Install Vercel Agent Skills: `npx add-skill vercel-labs/agent-skills`
- [ ] Configure Storybook
- [ ] Create first Feature Spec
- [ ] Set up CI/CD

---

## 📋 Checklist: Develop New Feature

- [ ] Create `spec.md` (use template)
- [ ] Define Schema (`packages/schemas`)
- [ ] Implement Domain logic (`services/backend/src/domain`)
- [ ] Create API Handler (`services/backend/src/handlers`)
- [ ] Build frontend (`apps/web/src/features`)
- [ ] Add tests
- [ ] Verify: `pnpm lint && pnpm test && pnpm build`

---

[中文版](INDEX.zh.md)
