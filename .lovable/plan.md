

## Plan: 修复月历中选中日期高亮错误

### 问题
`Calendar` 组件的 `selected` 属性当前设置为当前周的周一，而不是用户实际选中的日期，导致日历中高亮的日期与实际选中的日期不一致。

### 方案
将 `selected` 属性改为基于 `selectedDate` 状态构造的 `Date` 对象：

```typescript
selected={new Date(selectedDate + "T00:00:00")}
```

使用 `"T00:00:00"` 后缀确保解析为本地时间而非 UTC。

### 改动文件
- `src/components/ProgressPage.tsx` — 将第 99-103 行的 `selected` IIFE 替换为 `new Date(selectedDate + "T00:00:00")`

