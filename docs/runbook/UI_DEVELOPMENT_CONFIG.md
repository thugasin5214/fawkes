# UI开发实战配置

## 1. 快速设置Storybook

```bash
# 在apps/web目录下
cd apps/web

# 安装Storybook
npx storybook@latest init

# 安装shadcn/ui支持
pnpm add -D @storybook/addon-styling-webpack
```

### 配置文件

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
}

export default config
```

```typescript
// .storybook/preview.ts
import '../src/app/globals.css'  // 你的Tailwind CSS

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 添加暗色模式支持
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
}

export default preview
```

---

## 2. 组件Story模板

### 基础组件Story

```tsx
// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Loader2, Mail, Plus } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// 基础
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// 所有变体
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

// 带图标
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>
        <Mail className="mr-2 h-4 w-4" /> Login with Email
      </Button>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </div>
  ),
}

// Loading状态
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ),
}

// 所有尺寸
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="lg">Large</Button>
      <Button size="default">Default</Button>
      <Button size="sm">Small</Button>
      <Button size="icon"><Plus className="h-4 w-4" /></Button>
    </div>
  ),
}
```

### 页面/Feature Story

```tsx
// src/features/todo/TodoList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TodoList } from './components/TodoList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock数据
const mockTodos = [
  { id: '1', title: 'Learn Storybook', completed: true },
  { id: '2', title: 'Build awesome UI', completed: false },
  { id: '3', title: 'Ship to production', completed: false },
]

// Provider包装
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const withProviders = (Story: any) => (
  <QueryClientProvider client={queryClient}>
    <div className="max-w-md mx-auto p-4">
      <Story />
    </div>
  </QueryClientProvider>
)

const meta: Meta<typeof TodoList> = {
  title: 'Features/Todo/TodoList',
  component: TodoList,
  decorators: [withProviders],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof TodoList>

// 正常状态（带数据）
export const WithData: Story = {
  args: {
    todos: mockTodos,
    isLoading: false,
    error: null,
  },
}

// Loading状态
export const Loading: Story = {
  args: {
    todos: [],
    isLoading: true,
    error: null,
  },
}

// 空状态
export const Empty: Story = {
  args: {
    todos: [],
    isLoading: false,
    error: null,
  },
}

// 错误状态
export const Error: Story = {
  args: {
    todos: [],
    isLoading: false,
    error: new Error('Failed to load todos'),
  },
}

// 移动端视图
export const Mobile: Story = {
  args: {
    todos: mockTodos,
    isLoading: false,
    error: null,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
```

---

## 3. 视觉回归测试配置

### Playwright视觉测试

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  snapshotDir: './e2e/__snapshots__',
  
  // 视觉测试配置
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
  
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
})
```

```typescript
// e2e/visual/components.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 打开Storybook
    await page.goto('http://localhost:6006')
  })

  test('Button - All Variants', async ({ page }) => {
    // 导航到Button story
    await page.goto('http://localhost:6006/?path=/story/ui-button--all-variants')
    
    // 等待渲染
    await page.waitForSelector('[data-story-rendered="true"]')
    
    // 截图对比
    const frame = page.frameLocator('#storybook-preview-iframe')
    await expect(frame.locator('#storybook-root')).toHaveScreenshot('button-all-variants.png')
  })

  test('TodoList - All States', async ({ page }) => {
    const states = ['with-data', 'loading', 'empty', 'error']
    
    for (const state of states) {
      await page.goto(`http://localhost:6006/?path=/story/features-todo-todolist--${state}`)
      await page.waitForSelector('[data-story-rendered="true"]')
      
      const frame = page.frameLocator('#storybook-preview-iframe')
      await expect(frame.locator('#storybook-root')).toHaveScreenshot(`todolist-${state}.png`)
    }
  })
})
```

### 运行命令

```bash
# 首次运行，生成基准截图
pnpm exec playwright test e2e/visual --update-snapshots

# 之后运行，对比变化
pnpm exec playwright test e2e/visual

# 查看报告
pnpm exec playwright show-report
```

---

## 4. v0.dev工作流脚本

```bash
#!/bin/bash
# tools/scripts/import-v0.sh
# 从v0.dev导入组件的辅助脚本

echo "📦 v0.dev组件导入助手"
echo ""
echo "步骤："
echo "1. 去 https://v0.dev 生成组件"
echo "2. 点击 'Code' 复制代码"
echo "3. 粘贴到下面的文件路径"
echo ""

read -p "组件名称 (如 TodoList): " COMPONENT_NAME
read -p "放置目录 (如 src/features/todo/components): " TARGET_DIR

# 创建目录
mkdir -p "$TARGET_DIR"

# 创建组件文件
COMPONENT_FILE="$TARGET_DIR/$COMPONENT_NAME.tsx"

echo "请粘贴v0.dev生成的代码（输入 'END' 结束）："
echo ""

# 读取多行输入
CODE=""
while IFS= read -r line; do
  [[ "$line" == "END" ]] && break
  CODE+="$line"$'\n'
done

# 写入文件
echo "$CODE" > "$COMPONENT_FILE"

echo ""
echo "✅ 组件已保存到: $COMPONENT_FILE"
echo ""
echo "下一步："
echo "1. 检查导入是否正确 (shadcn/ui组件路径)"
echo "2. 替换为项目的设计token"
echo "3. 添加Storybook story"
echo ""
echo "建议的Claude Code任务："
echo "───────────────────────"
echo "请帮我调整 $COMPONENT_FILE："
echo "1. 确保使用 @/components/ui 的shadcn组件"
echo "2. 添加loading/empty/error状态"
echo "3. 创建对应的Storybook story"
```

---

## 5. 设计Token配置

```typescript
// packages/config/design-tokens.ts
// 统一的设计token，可以生成到各个框架

export const tokens = {
  colors: {
    // 语义化颜色
    primary: {
      DEFAULT: 'hsl(222.2 47.4% 11.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    secondary: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(222.2 47.4% 11.2%)',
    },
    destructive: {
      DEFAULT: 'hsl(0 84.2% 60.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    muted: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(215.4 16.3% 46.9%)',
    },
    accent: {
      DEFAULT: 'hsl(210 40% 96.1%)',
      foreground: 'hsl(222.2 47.4% 11.2%)',
    },
    // 功能性颜色
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 47.4% 11.2%)',
    card: 'hsl(0 0% 100%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 47.4% 11.2%)',
  },
  
  radius: {
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
  },
}

// 生成Tailwind配置
export function generateTailwindConfig() {
  return {
    theme: {
      extend: {
        colors: tokens.colors,
        borderRadius: tokens.radius,
        fontFamily: tokens.typography.fontFamily,
      },
    },
  }
}

// 生成CSS变量
export function generateCSSVariables() {
  // 用于shadcn/ui的CSS变量
  return `
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode colors */
}
  `
}
```

---

## 6. package.json脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    
    "test:visual": "playwright test e2e/visual",
    "test:visual:update": "playwright test e2e/visual --update-snapshots",
    "test:visual:report": "playwright show-report",
    
    "ui:import": "bash ../../tools/scripts/import-v0.sh"
  }
}
```

---

## 总结：完整的UI开发命令

```bash
# 日常开发
pnpm dev              # 启动开发服务器
pnpm storybook        # 启动Storybook

# 导入新UI
pnpm ui:import        # 从v0.dev导入组件

# 视觉测试
pnpm test:visual              # 运行视觉测试
pnpm test:visual:update       # 更新基准截图
pnpm test:visual:report       # 查看测试报告
```
