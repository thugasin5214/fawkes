---
name: fawkes
description: |
  Full-stack product development skill for rapid app iteration.
  Use this skill when:
  - Creating new features (Web/Mobile/Backend)
  - Modifying existing features
  - Adding UI components
  - Writing tests
  - Deploying to AWS

  Tech stack: Next.js + Expo (React Native) + AWS (Lambda/DynamoDB/CDK) + TypeScript

  This skill provides standardized workflows for agent-friendly development.
---

# Fawkes Skill

This skill enables rapid, production-grade app development across Web (Next.js), Mobile (Expo/React Native), and Backend (AWS).

## Core Principle

**Repo is the single source of truth.** All decisions must be in code/docs. Never rely on conversation memory.

## Directory Structure (MUST follow)

```
apps/
  web/src/features/[feature]/     # Web feature modules
  mobile/src/features/[feature]/  # Mobile feature modules
packages/
  ui/                             # Shared UI components
  schemas/                        # Zod schemas (API contracts)
  api-client/                     # Typed API client
services/
  backend/src/                    # Lambda handlers & domain logic
infra/
  cdk/                            # AWS CDK infrastructure
```

## Workflows

### 1. Creating a New Feature

**ALWAYS start by creating spec.md first.**

```bash
# Step 1: Create feature directories
mkdir -p apps/web/src/features/[name]
mkdir -p apps/mobile/src/features/[name]

# Step 2: Create spec.md (MOST IMPORTANT)
# Use template from references/feature-spec-template.md
```

Then implement in this order:

1. Schema (`packages/schemas/src/[name].ts`)
2. Backend (`services/backend/src/domain/[name].ts`)
3. API Handler (`services/backend/src/handlers/[name].ts`)
4. Frontend hooks (`apps/web/src/features/[name]/hooks.ts`)
5. Frontend UI (`apps/web/src/features/[name]/components/`)
6. Tests

### 2. Modifying Existing UI

Before making changes:

1. Read the feature's `spec.md`
2. Understand current state (loading/empty/error/success)
3. Make minimal, focused changes
4. Update tests if behavior changed

### 3. Adding Shared Components

Location: `packages/ui/src/primitives/` or `packages/ui/src/patterns/`

Component requirements:

- Props interface with TypeScript
- Works on both Web (react-native-web) and Mobile (React Native)
- Uses NativeWind (Tailwind) for styling
- Has Storybook story

### 4. Backend Development

Handler pattern (thin):

```typescript
// services/backend/src/handlers/[name].ts
export const handler: APIGatewayProxyHandler = async (event) => {
  // 1. Parse & validate input
  const input = Schema.parse(JSON.parse(event.body));

  // 2. Call domain logic
  const result = await domainFunction(input);

  // 3. Return response
  return { statusCode: 200, body: JSON.stringify(result) };
};
```

Domain logic (thick, testable):

```typescript
// services/backend/src/domain/[name].ts
export async function domainFunction(input: Input): Promise<Output> {
  // Business logic here
}
```

### 5. Infrastructure Changes

```bash
# Always diff before deploy
pnpm cdk:diff

# Deploy to dev first
pnpm cdk:deploy:dev

# Then staging, then prod
```

## Verification Commands (MUST pass before PR)

```bash
pnpm lint          # ESLint
pnpm typecheck     # TypeScript
pnpm test          # Unit tests
pnpm build         # Build all
pnpm cdk:synth     # CDK validation
```

## UI Task Template

When modifying UI, use this structure:

```markdown
## UI Task

**Scope**: apps/web/src/features/[feature]

**Spec**: Read spec.md first

**Changes**:

- [ ] Describe change 1
- [ ] Describe change 2

**Verify**:

- pnpm lint
- pnpm test
- pnpm build:web
```

## Common Patterns

### API Response Handling

```typescript
// In hooks
const { data, error, isLoading } = useQuery({
  queryKey: ['feature'],
  queryFn: () => apiClient.feature.list()
})

// In component
if (isLoading) return <Loading />
if (error) return <Error message={error.message} />
if (!data?.length) return <Empty />
return <List items={data} />
```

### Form Handling

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(FormSchema),
  defaultValues: { ... }
})

const onSubmit = async (data: FormData) => {
  try {
    await mutateAsync(data)
    toast.success('Saved!')
  } catch (e) {
    toast.error('Failed')
  }
}
```

## References

- `references/feature-spec-template.md` - Feature specification template
- `references/ui-patterns.md` - Common UI patterns
- `references/testing-guide.md` - Testing best practices
