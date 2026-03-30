

## Plan: 简化周日历日期颜色方案

### 问题
当前日期圆圈有 5 种状态组合（今天+选中、选中、今天、有照片、普通），颜色混乱不清晰。

### 方案
简化为 3 种清晰层级：

1. **选中日期**（无论是否今天）：`bg-primary text-primary-foreground` — 实心主色圆圈
2. **今天但未选中**：`border-2 border-primary text-primary` — 主色描边，无填充
3. **有照片但未选中**：底部加一个小圆点指示器 `w-1.5 h-1.5 rounded-full bg-primary`
4. **普通日期**：`text-foreground`

### 改动文件
- `src/components/ProgressPage.tsx` — 简化第 178-188 行的条件样式逻辑，移除 `ring` 和 `accent` 样式，增加照片小圆点指示器

