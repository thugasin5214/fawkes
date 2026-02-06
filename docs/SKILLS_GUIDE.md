# Claude Code Skills 推荐指南

> 可复用、不绑定特定Stack的成熟Skills

## 概述

Skills分为三类：

1. **Anthropic官方Skills** - 稳定、可直接使用
2. **Example Skills** - 可参考、可复制修改
3. **社区/自定义Skills** - 需要自己创建或从社区获取

---

## 🎯 推荐使用的Skills

### 1. 前端/UI相关

#### ✅ `frontend-design` (官方)

**用途**: 创建高质量、独特的前端界面，避免"AI味"

**特点**:

- 强调设计思维和美学方向
- 避免通用字体(Inter, Roboto)
- 支持React、HTML/CSS、Vue等
- **技术栈无关** - 只关注设计质量

**使用场景**:

- 创建Landing Page
- 设计Dashboard
- 美化现有UI

**路径**: `/mnt/skills/public/frontend-design/SKILL.md`

---

#### ✅ `web-artifacts-builder` (Example)

**用途**: 创建复杂的React组件/应用，打包为单文件

**特点**:

- React 18 + TypeScript + Vite + Tailwind
- 预装40+ shadcn/ui组件
- 自动打包为单个HTML文件
- **可复制修改** - 不绑定特定平台

**使用场景**:

- 快速原型
- 复杂交互组件
- 独立的Web工具

**路径**: `/mnt/skills/examples/web-artifacts-builder/SKILL.md`

**你可以改造它**: 修改init脚本，换成你自己的技术栈模板

---

#### ✅ `theme-factory` (Example)

**用途**: 统一的设计主题系统

**特点**:

- 10个预设主题（颜色+字体）
- 可应用到任何artifact
- 支持自定义主题
- **设计系统抽象** - 不绑定框架

**使用场景**:

- 统一多个页面的视觉风格
- 快速换肤
- 建立品牌一致性

**路径**: `/mnt/skills/examples/theme-factory/SKILL.md`

---

#### ✅ `canvas-design` (Example)

**用途**: 创建高质量视觉艺术/海报/设计

**特点**:

- 先创建"设计哲学"，再执行
- 输出.png/.pdf
- 强调工艺品质
- **纯设计** - 不涉及代码框架

**使用场景**:

- 海报设计
- 品牌视觉
- 艺术创作

**路径**: `/mnt/skills/examples/canvas-design/SKILL.md`

---

### 2. 后端/集成相关

#### ✅ `mcp-builder` (Example) ⭐ 强烈推荐

**用途**: 创建MCP Server，让Claude连接外部服务

**特点**:

- 支持TypeScript(推荐)和Python
- 完整的开发指南
- 包含评估方法
- **协议层** - 完全不绑定任何框架

**使用场景**:

- 集成第三方API (GitHub, Notion, Slack等)
- 创建自定义工具
- 扩展Claude能力

**路径**: `/mnt/skills/examples/mcp-builder/SKILL.md`

**为什么推荐**: MCP是协议层，你的MCP Server可以被任何支持MCP的agent使用，不只是Claude

---

#### ✅ `skill-creator` (Example) ⭐ 必备

**用途**: 创建你自己的Skills

**特点**:

- 完整的skill结构指南
- 渐进式加载设计
- 打包和验证脚本
- **元技能** - 用来创建其他技能

**路径**: `/mnt/skills/examples/skill-creator/SKILL.md`

---

### 3. 文档/输出相关

#### ✅ `docx` (官方)

**用途**: 创建/编辑Word文档

**特点**:

- 支持tracked changes
- 支持comments
- 保持格式
- **标准格式** - 任何地方都能用

**路径**: `/mnt/skills/public/docx/SKILL.md`

---

#### ✅ `xlsx` (官方)

**用途**: 创建/编辑Excel文件

**特点**:

- 支持公式
- 支持格式化
- 数据分析
- **标准格式**

**路径**: `/mnt/skills/public/xlsx/SKILL.md`

---

#### ✅ `pdf` (官方)

**用途**: 创建/操作PDF文件

**特点**:

- 提取文本和表格
- 创建新PDF
- 合并/分割
- 填写表单

**路径**: `/mnt/skills/public/pdf/SKILL.md`

---

#### ✅ `pptx` (官方)

**用途**: 创建/编辑PPT

**特点**:

- 创建演示文稿
- 编辑现有文件
- 支持布局和样式

**路径**: `/mnt/skills/public/pptx/SKILL.md`

---

## 🏗️ 如何不依赖特定Stack使用这些Skills

### 核心策略：抽象层分离

```
┌─────────────────────────────────────────┐
│           Your Product Stack            │
│  (Next.js + Expo + AWS + whatever)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Abstraction Layer               │
│  - Design Tokens (colors, fonts, space) │
│  - Component Contracts (props, states)  │
│  - API Contracts (schemas)              │
│  - Runbook (workflows)                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│          Skills (Stack-Agnostic)        │
│  - frontend-design (设计质量)           │
│  - theme-factory (主题系统)             │
│  - mcp-builder (外部集成)               │
│  - skill-creator (扩展能力)             │
└─────────────────────────────────────────┘
```

### 实践方法

#### 1. 设计层：用`theme-factory`思路

创建你自己的Design Tokens文件：

```typescript
// design-tokens.ts (技术栈无关)
export const tokens = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    text: "#1e293b",
  },
  typography: {
    fontFamily: {
      heading: "Poppins, sans-serif",
      body: "Inter, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
};
```

然后各框架各自实现：

- Tailwind: 转换为tailwind.config.js
- React Native: 转换为StyleSheet
- CSS: 转换为CSS Variables

#### 2. 组件层：用`frontend-design`思路

不是让agent直接写组件，而是先定义"组件契约"：

```typescript
// component-contracts/Button.contract.ts
interface ButtonContract {
  // Props
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  loading: boolean;

  // States
  states: ["idle", "hover", "active", "disabled", "loading"];

  // Accessibility
  ariaLabel: string;

  // Events
  onPress: () => void;
}
```

Agent按契约实现，不管是React还是Vue还是原生。

#### 3. 集成层：用`mcp-builder`

创建MCP Server作为"能力插件"：

```
your-mcp-servers/
├── notion-sync/      # 同步Notion
├── analytics/        # 数据分析
├── deployment/       # 部署自动化
└── content-gen/      # 内容生成
```

这些MCP Server完全独立于你的主Stack。

---

## 📦 推荐的Skill组合

### 对于你的Product Factory Stack

```yaml
必备:
  - skill-creator # 创建自定义skill的能力
  - frontend-design # UI质量保证
  - mcp-builder # 扩展集成能力

推荐:
  - theme-factory # 设计系统（可复制修改）
  - web-artifacts-builder # 快速原型（可复制修改）

文档输出:
  - docx # 生成规格文档
  - xlsx # 数据导出
  - pdf # 报告生成
```

### 创建你自己的Skills

基于skill-creator，建议你创建：

```yaml
your-skills/
├── stack-setup/           # 你的技术栈初始化
│   └── SKILL.md          # 一键创建项目骨架
├── feature-generator/     # Feature生成器
│   └── SKILL.md          # 按spec生成完整feature
├── api-contract/          # API契约生成
│   └── SKILL.md          # 从schema生成client
├── test-generator/        # 测试生成器
│   └── SKILL.md          # 按代码生成测试
└── deploy-helper/         # 部署助手
    └── SKILL.md          # CDK部署流程
```

---

## 🔗 不依赖特定Agent/Model的关键

### 1. Skills = 纯文档 + 脚本

Skills本质是：

- Markdown文档（指令）
- 可选的脚本（自动化）
- 可选的资源（模板、字体等）

任何能执行bash/python的agent都能用。

### 2. MCP = 标准协议

MCP是开放协议，不只是Claude：

- OpenAI正在支持
- 其他agent也可以接入
- 你的MCP Server是资产

### 3. 契约优先

你的核心资产是：

- Design Tokens
- Component Contracts
- API Schemas
- Runbooks

这些是**知识**，不是代码。任何agent都能读懂。

---

## ⚡ 快速开始

### 1. 下载可用的Skills

```bash
# 复制example skills到你的项目
cp -r /mnt/skills/examples/skill-creator ./my-skills/
cp -r /mnt/skills/examples/mcp-builder ./my-skills/
cp -r /mnt/skills/examples/theme-factory ./my-skills/
cp -r /mnt/skills/examples/web-artifacts-builder ./my-skills/
```

### 2. 修改适配你的Stack

以`web-artifacts-builder`为例：

```bash
# 修改init-artifact.sh，换成你的技术栈
# 比如改成 Next.js + NativeWind 模板
```

### 3. 创建你自己的Skill

使用`skill-creator`：

```
"帮我创建一个skill，用于在我的monorepo中生成新的feature模块"
```

---

## 总结

| Skill                   | 类型     | Stack依赖     | 推荐度     |
| ----------------------- | -------- | ------------- | ---------- |
| `frontend-design`       | 设计质量 | 无            | ⭐⭐⭐⭐⭐ |
| `mcp-builder`           | 集成扩展 | 无            | ⭐⭐⭐⭐⭐ |
| `skill-creator`         | 元技能   | 无            | ⭐⭐⭐⭐⭐ |
| `theme-factory`         | 设计系统 | 无（可复制）  | ⭐⭐⭐⭐   |
| `web-artifacts-builder` | 前端原型 | React（可改） | ⭐⭐⭐⭐   |
| `canvas-design`         | 视觉设计 | 无            | ⭐⭐⭐     |
| `docx/xlsx/pdf/pptx`    | 文档输出 | 无            | ⭐⭐⭐⭐   |

**核心思路**: Skills是"知识"和"流程"的封装，不是代码的封装。选择那些抽象层级高、不绑定具体实现的Skills。
