

## 首页每周进度真实化

### 当前问题
`weekData` 是硬编码的假数据，每天的高度和完成百分比都是固定值。

### 方案
从 `useWorkoutLogs` 获取本周的练习记录，按星期一到星期日统计每天的练习次数，动态计算柱状图高度和完成百分比。

### 实施步骤

**1. 在 `useWorkoutLogs.ts` 新增 `useWeeklyProgress` hook**
- 计算本周一到周日的日期范围
- 统计每天的练习次数
- 每天高度 = `(当天次数 / 本周最大次数) * 100%`，无记录则 0%
- 标记今天为 `active`
- 计算完成百分比 = `有练习的天数 / 7 * 100%`

**2. 修改 `HomePage.tsx`**
- 删除硬编码的 `weekData`
- 引入 `useWeeklyProgress`，用返回的动态数据渲染柱状图和百分比

### 涉及文件
- `src/hooks/useWorkoutLogs.ts`（新增 `useWeeklyProgress`）
- `src/components/HomePage.tsx`（替换静态 `weekData`）

