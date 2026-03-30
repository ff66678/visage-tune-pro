

## Plan: 月历点击日期同步切换到对应记录

### 问题
当前点击月历中的日期只会切换周视图的周偏移，但不会更新 `selectedDate`，导致照片卡片不会显示对应日期的记录。

### 方案
在 `ProgressPage.tsx` 的 `Calendar` 的 `onSelect` 回调中，除了现有的 `setWeekOffset` 逻辑外，增加一行 `setSelectedDate(date.toISOString().split("T")[0])` 来同步更新选中日期。

### 改动文件
- `src/components/ProgressPage.tsx` — 在 `onSelect` 回调第 107 行附近添加 `setSelectedDate`

