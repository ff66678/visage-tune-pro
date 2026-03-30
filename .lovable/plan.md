

## Plan: 修复日历日期选择偏移一天的 Bug

### 问题分析
`date.toISOString()` 会将日期转换为 UTC 时间，如果用户在 UTC+8 时区，点击 3月20日 时 `date` 是本地时间 `2026-03-20 00:00:00`，转为 UTC 后变成 `2026-03-19T16:00:00Z`，`.split("T")[0]` 就得到了 `"2026-03-19"`，导致偏移一天。

同样，`weekDiff` 的计算也可能因为时区导致不准确。

### 方案
在 `onSelect` 回调中，用本地时间方法构造日期字符串，替换 `toISOString()`：

```typescript
const yyyy = date.getFullYear();
const mm = String(date.getMonth() + 1).padStart(2, "0");
const dd = String(date.getDate()).padStart(2, "0");
const dateStr = `${yyyy}-${mm}-${dd}`;
setSelectedDate(dateStr);
```

同时检查组件中其他使用 `toISOString().split("T")[0]` 的地方（如 `todayStr`、`weekDates` 中的 `dateStr`），统一改为本地时间格式化，避免跨时区 bug。

### 改动文件
- `src/components/ProgressPage.tsx` — 将所有 `toISOString().split("T")[0]` 替换为本地日期格式化函数

