

## 修复：WorkoutPlayer 关闭后子页面不要重播入场动画

### 问题

WorkoutPlayer 点叉叉关闭后 `navigate(-1)` 回到 CourseDetail，CourseDetail 重新挂载时 `animate-slide-in-right` 再次播放，导致用户看到"下滑退出 + 右滑进入"两个动画叠加，不自然。

### 方案

利用已有的 `skipNextAnimation` 标志机制：

1. **WorkoutPlayer.tsx**：`handleClose` 中调用 `setSkipNextAnimation(true)`
2. **CourseDetail.tsx**（及其他子页面 Favorites、CategoryAll、RecentlyPlayed）：挂载时检查 `getSkipNextAnimation()`，如果为 `true` 则不添加 `animate-slide-in-right`，直接显示

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | `handleClose` 中 `navigate(-1)` 前调用 `setSkipNextAnimation(true)` |
| `src/pages/CourseDetail.tsx` | 用 `useEffect` 检查 `getSkipNextAnimation()`，为 true 时移除 `animate-slide-in-right` class 并重置标志 |
| `src/pages/Favorites.tsx` | 同上 |
| `src/pages/CategoryAll.tsx` | 同上 |
| `src/pages/RecentlyPlayed.tsx` | 同上 |

### 实现细节

**WorkoutPlayer.tsx** — handleClose 中添加：
```typescript
import { setSkipNextAnimation } from "@/lib/scrollPositions";
// ...
setTimeout(() => {
  setSkipNextAnimation(true);
  navigate(-1);
}, 340);
```

**CourseDetail.tsx 等子页面** — 改为条件性添加动画 class：
```tsx
const containerRef = useRef<HTMLDivElement>(null);
const shouldAnimate = !getSkipNextAnimation();

useEffect(() => {
  if (getSkipNextAnimation()) {
    setSkipNextAnimation(false);
  }
}, []);

// SwipeBack className 中用条件：
className={`... ${shouldAnimate ? 'animate-slide-in-right' : ''}`}
```

