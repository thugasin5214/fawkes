# Agent交互指南

> 如何让Agent（Claude Code或其他）高效地帮你开发

## 核心原则

### 1. Spec First（规格优先）

**永远先写spec，再让agent写代码。**

```
❌ 错误流程：
"帮我做一个todo功能" → Agent乱写 → 反复修改 → 崩溃

✅ 正确流程：
1. 你写 spec.md（或让agent帮你写）
2. 你review spec
3. Agent按spec实现
4. 验证命令全部通过
```

### 2. 小步快跑

**每次只做一件事，做完验证，再做下一件。**

```
❌ 错误："帮我把整个Todo功能做完"

✅ 正确：
1. "先帮我写Todo的Schema" → 验证
2. "写Todo的domain逻辑" → 验证
3. "写API handler" → 验证
4. "写前端hooks" → 验证
5. "写UI组件" → 验证
```

### 3. 验证驱动

**Agent每次修改后，必须运行验证命令。**

```bash
# 最小验证
pnpm lint && pnpm test && pnpm build

# 完整验证（如有必要）
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm cdk:synth
```

---

## 标准交互模板

### 模板1：新建Feature

```markdown
## 任务：创建 [Feature Name]

**Spec**: 请先阅读 `docs/specs/[feature]-spec.md`

**步骤**:
1. 在 `packages/schemas/src/` 创建 Schema
2. 在 `services/backend/src/domain/` 实现业务逻辑
3. 在 `services/backend/src/handlers/` 创建 API Handler
4. 在 `apps/web/src/features/[feature]/` 实现前端

**验证**: 每完成一步，运行 `pnpm lint && pnpm test && pnpm build`

**约束**:
- 严格按照spec实现
- 不要添加spec中没有的功能
- 保持代码风格一致
```

### 模板2：修改UI

```markdown
## 任务：修改 [Feature] 的 [Component]

**Scope**: `apps/web/src/features/[feature]/components/[component].tsx`

**Spec**: 参考 `apps/web/src/features/[feature]/spec.md`

**变更**:
- [ ] 变更点1
- [ ] 变更点2

**验证**:
```bash
pnpm lint
pnpm test
pnpm build:web
```

**约束**:
- 只修改指定文件
- 保持现有功能不变
- 更新相关测试（如有必要）
```

### 模板3：修复Bug

```markdown
## 任务：修复 Bug

**问题描述**: [描述问题现象]

**复现步骤**:
1. ...
2. ...
3. ...

**期望行为**: [描述正确的行为]

**可能的代码位置**:
- `apps/web/src/features/[feature]/...`
- `services/backend/src/...`

**验证**:
1. 本地复现bug
2. 修复
3. 验证修复有效
4. 运行 `pnpm test` 确保没有regression
```

### 模板4：添加测试

```markdown
## 任务：为 [Function/Component] 添加测试

**目标文件**: `[path]/[file].ts`

**测试位置**: `[path]/__tests__/[file].test.ts`

**需要覆盖的场景**:
- [ ] 正常情况
- [ ] 边界情况
- [ ] 错误处理

**参考**: `skills/fawkes/references/testing-guide.md`

**验证**: `pnpm test [file].test.ts`
```

---

## 最佳实践

### DO ✅

1. **提供清晰的上下文**
   ```
   ✅ "在 apps/web/src/features/todo/components/TodoList.tsx 中，
       修改 loading 状态的展示，从 spinner 改为 skeleton"
   ```

2. **引用具体的spec文件**
   ```
   ✅ "按照 docs/specs/todo-feature-spec.md 第4节 UI规格 实现"
   ```

3. **指定验证命令**
   ```
   ✅ "完成后运行 pnpm lint && pnpm test && pnpm build:web"
   ```

4. **分步骤给任务**
   ```
   ✅ "先实现schema，验证通过后再做下一步"
   ```

### DON'T ❌

1. **模糊的需求**
   ```
   ❌ "帮我优化一下这个页面"
   ❌ "让这个功能更好用"
   ```

2. **一次性给太多任务**
   ```
   ❌ "帮我把整个用户系统做完，包括注册登录个人资料..."
   ```

3. **不提供spec**
   ```
   ❌ "做一个评论功能" (没有spec)
   ```

4. **跳过验证**
   ```
   ❌ "不用测试了，直接继续"
   ```

---

## 常见场景

### 场景1：从零开始一个新功能

```markdown
Step 1: 先写Spec
"帮我写一个评论功能的spec，参考 skills/fawkes/references/feature-spec-template.md 模板"

Step 2: Review Spec
你review并调整spec

Step 3: 分步实现
"按照 docs/specs/comment-feature-spec.md 实现，先做Schema"
→ 验证
"继续，做domain逻辑"
→ 验证
"继续，做API handler"
→ 验证
"继续，做前端"
→ 验证
```

### 场景2：修改现有UI

```markdown
"我想修改 TodoList 组件：
1. 文件位置：apps/web/src/features/todo/components/TodoList.tsx
2. 修改内容：在空状态下显示一个带动画的图标
3. 参考spec：apps/web/src/features/todo/spec.md
4. 验证：pnpm lint && pnpm test && pnpm build:web

请只修改这一个文件。"
```

### 场景3：Debug一个问题

```markdown
"Bug：点击完成Todo后，状态没有更新

我已经检查了：
- API返回200，数据正确
- 问题应该在前端状态更新

可能相关的文件：
- apps/web/src/features/todo/hooks.ts
- apps/web/src/features/todo/components/TodoItem.tsx

请帮我定位并修复这个问题。"
```

### 场景4：添加新的API端点

```markdown
"需要添加一个批量删除todos的API：

1. Endpoint: DELETE /api/todos/batch
2. Request: { ids: string[] }
3. Response: { deleted: number }

请按以下顺序实现：
1. 在packages/schemas添加schema
2. 在services/backend/src/domain添加逻辑
3. 在services/backend/src/handlers添加handler
4. 添加单元测试

每步完成后运行 pnpm test 验证。"
```

---

## 故障恢复

### 如果Agent改错了

```markdown
"请撤销上一次的修改，回到之前的状态"

或者直接用git：
git checkout -- [file]
git stash
```

### 如果验证失败

```markdown
"pnpm lint 失败了，错误信息如下：
[粘贴错误信息]

请修复这些lint错误。"
```

### 如果Agent不理解需求

```markdown
"我重新解释一下需求：
[更详细的说明]

关键点：
1. ...
2. ...
3. ...

请确认你理解了再开始。"
```

---

## 建立你自己的规范

随着项目发展，你会发现一些反复出现的模式。把它们固化为：

1. **新的spec模板** - 放在 `docs/templates/`
2. **新的代码模板** - 放在 `tools/templates/`
3. **新的skill** - 扩展 `skills/fawkes/`

这样你的项目会越来越"agent友好"。
