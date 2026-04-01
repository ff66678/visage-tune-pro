

## Plan: 统一有照片日期的浅色圈样式

### 改动

**`src/components/ProgressPage.tsx`** — 两处修改：

1. **周历条（第197-204行）**：`d.isToday` 分支去掉边框，改为与 `hasPhoto` 一致的浅色背景 `bg-primary/15 text-primary`。今天如果没照片也不再显示虚圈，只用文字颜色区分。

```
d.isSelected → bg-primary text-primary-foreground shadow-md（不变）
d.hasPhoto   → bg-primary/15 text-primary font-bold（不变）
d.isToday    → bg-primary/15 text-primary（改为浅色圈，去掉 border）
默认         → text-foreground（不变）
```

2. **月历弹窗（第131-134行）**：`day_today` 样式也加上 `bg-primary/15`，与 `hasPhoto` 颜色统一：

```tsx
day_today: "bg-primary/15 text-primary font-bold aria-selected:bg-primary aria-selected:text-primary-foreground"
```

这样周历和月历中，有照片的日期和今天都统一使用相同的浅色圆圈，视觉一致。

