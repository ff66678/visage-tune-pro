

## 修复：WorkoutPlayer 关闭时跳过 Index 的滑入动画

### 问题

当前 WorkoutPlayer 关闭后导航到 `/?tab=X`，Index 挂载时 else 分支会播放 `animate-slide-in-left`（从左滑入），导致用户看到 WorkoutPlayer 下滑退出后，Index 页面又从左滑入，视觉上像"经过了详情页"。

### 方案

在 `scrollPositions.ts` 中新增一个 `skipAnimation` 标志。WorkoutPlayer 关闭时设置该标志为 `true`，Index 挂载时检查该标志，如果为 `true` 则跳过所有入场动画，直接显示内容。

### 改动

| 文件 | 改动 |
|---|---|
| `src/lib/scrollPositions.ts` | 新增 `skipNextAnimation` 标志及 getter/setter |
| `src/pages/WorkoutPlayer.tsx` | `handleClose` 中导航前设置 `setSkipNextAnimation(true)` |
| `src/pages/Index.tsx` | 动画 effect 中先检查 `getSkipNextAnimation()`，如果为 true 则跳过动画直接显示，并恢复滚动位置 |

