

## WorkoutPlayer 关闭按钮 + 下滑退出动画

### 改动

| 文件 | 改动 |
|---|---|
| `tailwind.config.ts` | 添加 `slide-out-down` keyframe（从 `translateY(0)` → `translateY(100%)`）和 `slide-in-up` keyframe（从 `translateY(100%)` → `translateY(0)`） |
| `src/pages/WorkoutPlayer.tsx` | 1) 将 `ChevronLeft` 图标换成 `X` 图标；2) 关闭按钮点击时不直接 `navigate(-1)`，而是先给整个页面容器播放 `slide-out-down` 动画（向下滑出），动画结束后再 `navigate(-1)`；3) 页面入场时用 `slide-in-up` 从下往上滑入（替代原来的 `slide-in-right`）；4) 移除 `SwipeBack` 包裹（因为这个页面改用上下滑动交互，左滑返回不适合） |

### 具体实现

**关闭逻辑**：
```tsx
const containerRef = useRef<HTMLDivElement>(null);

const handleClose = () => {
  if (containerRef.current) {
    containerRef.current.style.transition = "transform 0.35s ease-in, opacity 0.35s ease-in";
    containerRef.current.style.transform = "translateY(100%)";
    containerRef.current.style.opacity = "0";
    setTimeout(() => navigate(-1), 320);
  }
};
```

按钮从 `<ChevronLeft>` 改为 `<X>`，onClick 调用 `handleClose`。

