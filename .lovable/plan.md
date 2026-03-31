

## Plan: 重新设计个人资料页 — 统计资料、连续记录、礼物卡片

参考截图中的 Calm 风格布局，但保持当前 APP 的暖色调配色。从上到下三个模块。

### 改动文件
**`src/components/ProfileDetailContent.tsx`** — 重写统计和坚持记录区域，新增礼物卡片

### 布局设计

**1. 统计资料卡片**（替换现有 Stats + 热力图区域）
- 一个大圆角深色卡片（`bg-surface-elevated`）
- 顶部居中：徽章样式的圆形，内含打卡天数（streak），下方文字"练习天数"
- 底部一排三个统计项（图标 + 标签 + 数值）：总课程数、练习总时长（从 logs 累加 duration_seconds）、最长连续记录
- 卡片底部：一个白色大圆角按钮"分享我的统计资料"，调用 Web Share API

**2. 连续记录卡片**（替换现有坚持记录热力图）
- 同样深色圆角卡片
- 顶部一排三个统计项：总计连续记录数、最长连续天数、当前连续天数
- 分隔线
- 下方显示当月日历（简易月历），标记有练习记录的日期，今日高亮
- 支持左箭头切换上月
- 底部："分享我的连续记录"按钮

**3. 礼物卡片**（替换现有 Hero 推荐课程卡片 + Promo 区域）
- 金色渐变卡片（使用 `accent-gold` 色调），圆角，内含礼物图标 + "赠送 GLOW 礼物" + 描述文字 + "继续"按钮
- 下方：一个深色小卡片，显示个性化鼓励文案（如"你的练习之旅已经达到 X 天"）+ 当前日期

### 数据来源
- 练习天数、总课程数、连续记录：已有 `useWorkoutStats`
- 练习总时长：从 `useWorkoutLogs` 的 logs 累加 `duration_seconds`
- 最长连续记录：需在 `useWorkoutStats` 中新增计算
- 日历标记：从 logs 提取有记录的日期

### 需要修改的文件
1. **`src/hooks/useWorkoutLogs.ts`** — `useWorkoutStats` 新增 `totalDuration`（总秒数）和 `longestStreak`（最长连续天数）
2. **`src/components/ProfileDetailContent.tsx`** — 重写整个内容区域为三个卡片模块

### 保留不变
- 顶部头像、昵称、加入日期区域
- 最近练习列表
- SettingsDrawer

