# Quick Start: 从零搭建Product Factory

> 预计时间：30分钟完成基础骨架

## Step 1: 初始化Monorepo (5分钟)

```bash
# 创建项目目录
mkdir my-product && cd my-product

# 初始化pnpm workspace
pnpm init

# 创建workspace配置
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'infra/*'
EOF

# 创建turbo配置
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "test": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# 安装turbo
pnpm add -D turbo -w
```

## Step 2: 创建目录结构 (2分钟)

```bash
# 创建所有目录
mkdir -p apps/{web,mobile}
mkdir -p packages/{ui,schemas,api-client,config}
mkdir -p services/backend
mkdir -p infra/cdk
mkdir -p tools/scripts
mkdir -p docs/{runbook,adr,specs}
mkdir -p e2e/{web,api}
mkdir -p .github/workflows
```

## Step 3: 初始化Web应用 (5分钟)

```bash
cd apps/web

# 使用Next.js创建
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 添加开发依赖
pnpm add -D @types/node @types/react

cd ../..
```

## Step 4: 初始化Mobile应用 (5分钟)

```bash
cd apps/mobile

# 使用Expo创建
npx create-expo-app@latest . --template blank-typescript

# 安装Expo Router
npx expo install expo-router expo-linking expo-constants expo-status-bar

# 安装NativeWind
pnpm add nativewind
pnpm add -D tailwindcss@3.3.2

cd ../..
```

## Step 5: 初始化共享Packages (5分钟)

```bash
# packages/schemas
cd packages/schemas
pnpm init
pnpm add zod
cat > src/index.ts << 'EOF'
export * from './user'
export * from './auth'
EOF

mkdir src
cat > src/user.ts << 'EOF'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.string().datetime()
})

export type User = z.infer<typeof UserSchema>
EOF

cat > src/auth.ts << 'EOF'
import { z } from 'zod'

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const LoginResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string().datetime()
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
EOF

cd ../..

# packages/ui (占位)
cd packages/ui
pnpm init
mkdir src
cat > src/index.ts << 'EOF'
// 共享UI组件
export { Button } from './primitives/Button'
EOF
mkdir -p src/primitives
cd ../..
```

## Step 6: 初始化Backend (5分钟)

```bash
cd services/backend
pnpm init
pnpm add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
pnpm add -D vitest @types/aws-lambda esbuild

mkdir -p src/{handlers,domain,data,lib}
mkdir -p test/{unit,integration}

# 创建简单的health handler
cat > src/handlers/health.ts << 'EOF'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
  }
}
EOF

cd ../..
```

## Step 7: 初始化CDK (5分钟)

```bash
cd infra/cdk

# 初始化CDK项目
npx cdk init app --language typescript

# 会自动创建基础结构
# 修改 lib/cdk-stack.ts 添加API Gateway和Lambda

cd ../..
```

## Step 8: 配置根package.json

```bash
cat > package.json << 'EOF'
{
  "name": "my-product",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:mobile": "turbo run dev --filter=mobile",
    "build": "turbo run build",
    "build:web": "turbo run build --filter=web",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "cdk:synth": "cd infra/cdk && cdk synth",
    "cdk:diff": "cd infra/cdk && cdk diff",
    "cdk:deploy:dev": "cd infra/cdk && cdk deploy --context env=dev",
    "cdk:deploy:staging": "cd infra/cdk && cdk deploy --context env=staging",
    "cdk:deploy:prod": "cd infra/cdk && cdk deploy --context env=prod"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
EOF
```

## Step 9: 验证安装

```bash
# 安装所有依赖
pnpm install

# 运行lint
pnpm lint

# 运行测试
pnpm test

# 构建
pnpm build
```

## ✅ 完成！

现在你有了一个完整的Monorepo骨架：

- ✅ Web应用 (Next.js)
- ✅ Mobile应用 (Expo)
- ✅ 共享Schema (Zod)
- ✅ 共享UI (待填充)
- ✅ Backend (AWS Lambda)
- ✅ Infrastructure (AWS CDK)
- ✅ 统一的命令 (pnpm scripts)

---

## 下一步

1. 阅读 `RUNBOOK.md` 了解完整规范
2. 创建第一个Feature（参考Feature Spec模板）
3. 配置CI/CD（参考 `.github/workflows/` 模板）
