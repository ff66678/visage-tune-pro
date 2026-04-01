

## 改回 WorkoutPlayer 关闭时返回上一页

### 问题

当前 WorkoutPlayer 关闭时用 `navigate(target, { replace: true })` 跳到 `/?tab=X` 或 `fromCourse`，这会跳过中间页面（如 CourseDetail），直接回到 Tab 首页。用户希望恢复为返回上一个页面（即 CourseDetail）。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | `handleClose` 改为 `navigate(-1)`，移除 `fromTab`/`fromCourse` 相关逻辑，移除 `setSkipNextAnimation` |

### 具体变更

**WorkoutPlayer.tsx `handleClose`**：

```typescript
const handleClose = useCallback(() => {
  if (!containerRef.current) return;
  const el = containerRef.current;
  el.classList.remove("animate-slide-in-up");
  el.style.willChange = "transform";
  requestAnimationFrame(() => {
    el.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 1, 1)";
    el.style.transform = "translate3d(0, 100%, 0)";
    setTimeout(() => navigate(-1), 340);
  });
}, [navigate]);
```

- 删除 `fromTab`、`fromCourse` 的读取和使用
- 删除 `setSkipNextAnimation(true)`（不再需要，因为不会重新挂载 Index）
- 用 `navigate(-1)` 回到浏览器历史中的上一页（CourseDetail），浏览器自动恢复滚动位置

