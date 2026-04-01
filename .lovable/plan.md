

## 优化滑动交互丝滑度

### 问题分析

1. **SwipeBack（左滑返回）**：当前使用 React 的 `onTouchMove` 事件，没有使用 `will-change` 以外的 GPU 加速手段，且 `transform` 和 `opacity` 在每次 touchmove 都直接赋值，可能因布局重计算导致卡顿。页面内容与背景图分离是因为 SwipeBack 只包裹了子组件的 children，而背景图可能在不同层级。
2. **WorkoutPlayer（上下滑动关闭）**：目前没有下拉手势，只有按钮关闭。关闭动画使用 `translateY(100%)` 但背景图是 `absolute inset-0`，整个容器一起动所以没有分离问题。
3. **丝滑优化**：需要在 touchmove 中使用 `requestAnimationFrame` 节流，并确保 GPU 合成层优化。

### 改动

| 文件 | 改动 |
|---|---|
| `src/components/SwipeBack.tsx` | 1) 使用 `requestAnimationFrame` 节流 touchmove，避免每次事件都触发样式更新；2) 添加 `transform: translate3d(0,0,0)` 强制 GPU 合成层；3) 在 touchstart 时设置 `will-change: transform`，touchend 后移除 |
| `src/pages/WorkoutPlayer.tsx` | 添加下拉手势关闭：从页面上半部分下拉超过阈值时触发关闭动画。使用同样的 RAF 节流 + GPU 加速确保丝滑 |

### SwipeBack 优化实现

```tsx
// 关键改动：RAF 节流
const rafId = useRef(0);

const onTouchMove = useCallback((e: React.TouchEvent) => {
  if (!isSwiping.current) return;
  const x = e.touches[0].clientX;
  cancelAnimationFrame(rafId.current);
  rafId.current = requestAnimationFrame(() => {
    if (!containerRef.current) return;
    const deltaX = Math.max(0, x - startX.current);
    currentX.current = deltaX;
    const opacity = 1 - deltaX / window.innerWidth * 0.4;
    containerRef.current.style.transform = `translate3d(${deltaX}px, 0, 0)`;
    containerRef.current.style.opacity = `${Math.max(0.6, opacity)}`;
  });
}, []);
```

### WorkoutPlayer 下拉手势实现

```tsx
// 在 containerRef 上监听 touch 事件
const startY = useRef(0);
const currentY = useRef(0);
const isSwipingDown = useRef(false);

// touchstart: 记录起始 Y
// touchmove: RAF 节流，translate3d(0, deltaY, 0) 跟手
// touchend: deltaY > 屏幕高度 1/4 则触发关闭，否则弹回
```

整个容器（包含背景图）一起移动，确保页面与图片不分离。使用 `translate3d` 保持 GPU 加速，RAF 节流保证 60fps 丝滑。

