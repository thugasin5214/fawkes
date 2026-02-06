# UI开发与Agent协作指南

> 不擅长设计也能做出好UI的完整工作流

## 核心策略

```
不要让Agent"设计"，让Agent"组装"
```

**关键洞察**：

- Agent擅长：按规则组合组件、实现交互逻辑、遵循设计系统
- Agent不擅长：原创视觉设计、审美判断
- 你不需要会设计，你需要会**选择**和**描述**

---

## 第一层：使用成熟的设计系统（90%的UI问题解决在这里）

### 推荐方案

| 方案             | 适用场景       | 特点                              |
| ---------------- | -------------- | --------------------------------- |
| **shadcn/ui** ⭐ | Web应用        | 可复制代码、高度可定制、Agent友好 |
| **Radix UI**     | 需要无样式基础 | 只有行为、自己加样式              |
| **Tailwind UI**  | 需要更多模板   | 付费、高质量模板                  |
| **Tamagui**      | 跨平台         | React Native + Web统一            |

### 为什么shadcn/ui对Agent最友好？

```tsx
// shadcn/ui的组件是"复制到你项目里的代码"
// 不是黑盒依赖，Agent可以直接修改

// components/ui/button.tsx - 你完全拥有这个文件
export function Button({ variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), props.className)}
      {...props}
    />
  );
}
```

### 安装命令

```bash
# 初始化shadcn/ui
npx shadcn@latest init

# 添加需要的组件
npx shadcn@latest add button card dialog form input
```

---

## 第二层：使用v0.dev生成UI原型

### 什么是v0.dev？

Vercel的AI UI生成工具：https://v0.dev

**工作流**：

```
1. 用自然语言描述你想要的UI
2. v0生成React + Tailwind + shadcn/ui代码
3. 复制代码到你的项目
4. 让Claude Code在此基础上迭代
```

### 示例

**你的描述**：

```
A dashboard with:
- Sidebar navigation on the left
- Header with user avatar and notifications
- Main content area with stats cards
- Dark mode support
```

**v0.dev生成** → **复制代码** → **Claude Code迭代**

### 关键技巧

```markdown
## 给Claude Code的任务

**参考**: 我从v0.dev生成了这个组件 [粘贴代码]

**修改需求**:

1. 把颜色改成我们的设计token
2. 添加loading状态
3. 添加空状态
4. 适配移动端

**约束**: 保持现有的布局结构，只修改样式和状态
```

---

## 第三层：本地预览和快速迭代

### 必备工具

```bash
# 1. 开发服务器（热重载）
pnpm dev

# 2. Storybook（组件级别预览）
pnpm storybook
```

### Storybook是关键！

**为什么Storybook对UI迭代至关重要**：

```
没有Storybook:
  你: "改一下按钮样式"
  Agent: [修改代码]
  你: 要刷新整个app，导航到那个页面，才能看到效果

有Storybook:
  你: "改一下按钮样式"
  Agent: [修改代码]
  你: 在Storybook里立刻看到所有按钮变体的效果
```

### 设置Storybook

```bash
# 安装
npx storybook@latest init

# 运行
pnpm storybook  # 打开 http://localhost:6006
```

### Story示例

```tsx
// components/ui/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  // 自动生成所有props的控制面板
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
};

export default meta;

// 各种状态的预览
export const Default: StoryObj<typeof Button> = {
  args: { children: "Button" },
};

export const Destructive: StoryObj<typeof Button> = {
  args: { variant: "destructive", children: "Delete" },
};

export const Loading: StoryObj<typeof Button> = {
  args: { children: "Loading...", disabled: true },
};

// 所有变体一览
export const AllVariants: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

---

## 第四层：给Agent的UI任务模板

### 模板1：从零创建页面

```markdown
## 任务：创建 [页面名称]

**参考设计**:

- v0.dev链接: [如果有]
- 参考截图: [如果有]
- 类似的网站: [如果有]

**使用组件库**: shadcn/ui

**页面结构**:
```

Header
├── Logo
├── Navigation
└── User Menu

Main Content
├── Section 1: [描述]
├── Section 2: [描述]
└── Section 3: [描述]

Footer (可选)

```

**状态**:
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Success

**响应式**:
- Mobile: [描述移动端布局]
- Desktop: [描述桌面端布局]

**验证**:
1. `pnpm dev` 本地预览
2. 添加Storybook story
3. 检查移动端适配
```

### 模板2：修改现有UI

```markdown
## 任务：修改 [组件/页面]

**当前问题**: [描述你不满意的地方]

**期望效果**:

- [具体描述1]
- [具体描述2]

**参考**: [截图/链接/描述]

**约束**:

- 不要改变整体布局
- 保持现有的交互逻辑
- 只修改样式

**验证**: 在Storybook中检查修改效果
```

### 模板3：复制参考设计

```markdown
## 任务：参考 [网站/截图] 实现UI

**参考**: [URL或描述]

**我喜欢的部分**:

- [具体元素1]
- [具体元素2]

**需要调整的**:

- [调整点1]
- [调整点2]

**技术约束**:

- 使用shadcn/ui组件
- 使用Tailwind CSS
- 支持暗色模式
```

---

## 第五层：视觉验证方法

### 方法1：截图对比（手动）

```
1. 修改前截图
2. Agent修改代码
3. 修改后截图
4. 对比决定是否接受
```

### 方法2：Storybook视觉测试（半自动）

```bash
# 安装chromatic（免费tier够用）
npm install -D chromatic

# 运行视觉测试
npx chromatic --project-token=xxx
```

Chromatic会：

- 对每个story截图
- 与上次对比
- 高亮变化
- 你approve或reject

### 方法3：Playwright截图测试（自动化）

```typescript
// e2e/visual.spec.ts
import { test, expect } from "@playwright/test";

test("homepage visual", async ({ page }) => {
  await page.goto("/");

  // 等待加载完成
  await page.waitForLoadState("networkidle");

  // 截图对比
  await expect(page).toHaveScreenshot("homepage.png", {
    maxDiffPixels: 100, // 允许100像素差异
  });
});
```

```bash
# 首次运行，生成基准截图
pnpm exec playwright test --update-snapshots

# 之后运行，对比变化
pnpm exec playwright test
```

---

## 第六层：移动端UI测试

### React Native / Expo

```bash
# 启动Expo
pnpm mobile:start

# 在手机上扫码预览（Expo Go app）
# 或使用模拟器
pnpm mobile:ios
pnpm mobile:android
```

### 关键：设备预览

```
不要只在电脑上开发移动端UI！

工作流：
1. 开发时手机放旁边
2. 用Expo Go实时预览
3. 每次修改立刻在真机上看效果
```

---

## 实战工作流示例

### 场景：开发一个Todo List页面

```
Step 1: 生成初始UI
─────────────────
去v0.dev，输入：
"A todo list app with:
- Add todo form at top
- List of todos with checkboxes
- Swipe to delete on mobile
- Filter tabs: All, Active, Completed
- Clean minimal design"

复制生成的代码到项目

Step 2: 让Agent适配
─────────────────
"我从v0.dev复制了这个TodoList组件：
[粘贴代码]

请帮我：
1. 替换成我们项目的shadcn/ui组件
2. 添加loading/empty/error状态
3. 连接到我们的API (参考 packages/api-client)
4. 添加Storybook stories"

Step 3: 本地验证
─────────────────
- pnpm dev 查看整体效果
- pnpm storybook 查看组件各状态
- 手机上预览移动端效果

Step 4: 迭代调整
─────────────────
"TodoList的问题：
1. checkbox太小，手机上难点击
2. 空状态的图标太大
3. 想要添加一个微动画

请修改，参考Storybook里的TodoList story验证"

Step 5: 视觉验证
─────────────────
- 截图对比
- 或运行Playwright视觉测试
- 确认满意后合并
```

---

## 推荐的工具组合

```yaml
设计参考:
  - v0.dev # AI生成初始UI
  - Dribbble/Mobbin # 找设计灵感
  - 竞品截图 # 参考现有产品

组件库:
  - shadcn/ui # 主力组件库
  - Radix UI # 底层primitives
  - Lucide Icons # 图标

开发预览:
  - Next.js dev server # 热重载
  - Storybook # 组件预览
  - Expo Go # 移动端预览

视觉验证:
  - 手动截图对比 # 最简单
  - Chromatic # Storybook视觉测试
  - Playwright # E2E视觉测试
```

---

## 关键心态转变

### 从"我要设计"到"我要选择和组合"

```
❌ 错误思路：
"我不会设计，所以UI会很丑"

✅ 正确思路：
"我使用成熟的设计系统（shadcn/ui）
 参考好的设计（v0.dev/Dribbble）
 让Agent按规则组装
 用Storybook快速验证
 迭代直到满意"
```

### 从"一次做完"到"快速迭代"

```
❌ 错误流程：
描述完整需求 → Agent生成 → 不满意 → 重来

✅ 正确流程：
粗略描述 → 生成原型 → 预览 → 小调整 → 预览 → 小调整 → ...
```

---

## 总结

```
UI开发 = 选择设计系统 + 参考优秀设计 + Agent组装 + 快速预览迭代

工具链:
v0.dev → shadcn/ui → Storybook → 迭代 → 完成
```
