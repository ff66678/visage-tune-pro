

## 优化 WorkoutPlayer 叉叉关闭动画丝滑度

### 问题

当前关闭动画存在两个问题：
1. **入场动画**使用 CSS class `animate-slide-in-up`（0.35s ease-out），但退出时用 JS 设置 `transition` + `transform`，两种方式混用可能冲突
2. 退出动画使用 `ease-in` 缓动 + 同时改 opacity 和 transform，视觉上不够丝滑
3. `backdrop-blur-3xl` 等模糊效果在动画过程中会拖慢渲染

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | 优化 `handleClose` 动画和入场方式 |

### 具体优化

1. **入场**：保持 `animate-slide-in-up`，但在 `containerRef` 上添加 `will-change: transform` 预提示 GPU 合成
2. **退出动画优化**：
   - 缓动改为 `cubic-bezier(0.4, 0, 1, 1)`（更自然的加速退出）
   - 只做 `translate3d` 位移，不同时改 opacity（避免双重动画卡顿）
   - 动画前先移除 `backdrop-blur` 相关样式，减轻 GPU 负担
   - 使用 `requestAnimationFrame` 确保样式在下一帧生效，避免跳帧

```tsx
const handleClose = useCallback(() => {
  if (!containerRef.current) return;
  const el = containerRef.current;
  // 移除入场动画残留
  el.classList.remove("animate-slide-in-up");
  // 强制合成层 + 提前准备
  el.style.willChange = "transform";
  requestAnimationFrame(() => {
    el.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 1, 1)";
    el.style.transform = "translate3d(0, 100%, 0)";
    setTimeout(() => navigate(`/?tab=${fromTab}`, { replace: true }), 340);
  });
}, [navigate, fromTab]);
```

关键改进：去掉 opacity 变化（减少一半计算量），用更合适的缓动曲线，用 RAF 避免跳帧。

