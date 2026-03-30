

## Plan: 底部进度条使用真实计时数据

### 问题
底部进度条的已用时间 `04:12` 和进度宽度 `35%` 都是硬编码假数据。

### 方案
用已有的 `seconds` 和 `totalSeconds` 状态计算真实进度：

- **已用时间** = `totalSeconds - seconds`，用 `formatTime()` 格式化
- **总时长** = 从 `course.duration`（字符串如 `"8 分钟"`）解析秒数，同时用它初始化 `totalSeconds`（替换硬编码的 60）
- **进度百分比** = `elapsed / totalSeconds * 100`
- **右侧总时长** = `formatTime(totalSeconds)`

### 改动文件
- `src/pages/WorkoutPlayer.tsx`
  - 解析 `course.duration` 字符串为秒数，用于初始化 `totalSeconds` 状态（默认 60s）
  - 将 `totalSeconds` 从常量改为 state，在 course 加载后更新
  - 第 126 行：`04:12` → `formatTime(totalSeconds - seconds)`
  - 第 128 行：`width: "35%"` → `width: \`${((totalSeconds - seconds) / totalSeconds) * 100}%\``
  - 第 130 行：`course?.duration || "12:00"` → `formatTime(totalSeconds)`

