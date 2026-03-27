

## 首页打卡天数真实化

### 问题
"连续打卡 12 天" 是硬编码的假数据。

### 方案
`useWorkoutLogs.ts` 中的 `useWorkoutStats` 已经有 `streak` 计算逻辑（统计截止到今天的连续练习天数），直接在 `HomePage.tsx` 中引用即可。

### 改动

**`src/components/HomePage.tsx`**
- 引入 `useWorkoutStats`
- 将第 157 行 `连续打卡 12 天` 替换为 `连续打卡 {streak} 天`
- 根据 streak 值动态显示鼓励文案（0 天："今天开始打卡吧！"，≥1 天："太棒了，继续保持！"）

### 涉及文件
- `src/components/HomePage.tsx`（约 3 行改动）

