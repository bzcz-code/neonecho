# NeonEcho 项目规则

> **核心原则**: 一次只读一个里程碑文档，避免上下文窗口溢出

---

## 里程碑文档索引

| 里程碑 | 文档 | 状态 |
|--------|------|------|
| M1 | `prd-milestone-1.md` | 视觉基座与契约 |
| M2 | `prd-milestone-2.md` | 核心魔法与资产管线 |
| M3 | `prd-milestone-3.md` | 灵魂注入与中枢连线 |
| M4 | `prd-milestone-4.md` | 生产力补全与细节打磨 |

---

## 开发规则

### 1. 单里程碑聚焦

```
开发M1 → 只读 prd-milestone-1.md
开发M2 → 只读 prd-milestone-2.md
开发M3 → 只读 prd-milestone-3.md
开发M4 → 只读 prd-milestone-4.md
```

### 2. 禁止行为

- ❌ 禁止一次性读取多个里程碑文档
- ❌ 禁止在开发M1时读取M2/M3/M4文档
- ❌ 禁止将所有PRD内容复制到对话中

### 3. 正确流程

```
1. 用户说"开始M1开发"
2. AI只读取 prd-milestone-1.md
3. 完成M1后，用户说"开始M2开发"
4. AI只读取 prd-milestone-2.md
5. 以此类推...
```

### 4. 跨里程碑依赖

如果当前里程碑需要参考前置里程碑的内容：

```
M2需要M1的类型定义 → 只读取 shared/types.ts（不读PRD）
M3需要M2的Shader → 只读取具体Shader文件（不读PRD）
```

### 5. 快速定位命令

| 命令 | 动作 |
|------|------|
| `开始M1` | 读取 prd-milestone-1.md |
| `开始M2` | 读取 prd-milestone-2.md |
| `开始M3` | 读取 prd-milestone-3.md |
| `开始M4` | 读取 prd-milestone-4.md |
| `查看进度` | 读取 tasks/milestone.md |

---

## 当前状态

- **当前里程碑**: 未开始
- **下一步**: 用户输入"开始M1"启动开发

---

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
- 用playwrite截图多张前端画面，使用minimax描述，与milestone.md里的目标对比

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
