

## 优化 WorkoutPlayer 入场动画丝滑度

### 问题

当前 `slide-in-up` 动画有两个问题：
1. **同时变 opacity 和 transform**：从 `opacity: 0` → `1` + `translateY(100%)` → `0`，opacity 变化导致首帧"闪白"或渲染延迟
2. **CSS animation 与内联 style 冲突**：`className` 设了 `animate-slide-in-up`，同时 `style` 设了 `transform: translate3d(0,0,0)`，两者可能在首帧打架
3. **没有 `will-change` 预提示**，浏览器来不及提升合成层

### 改动

| 文件 | 改动 |
|---|---|
| `tailwind.config.ts` | `slide-in-up` 动画去掉 opacity 变化，只做 `translateY`；使用 `translate3d` 强制 GPU 加速 |
| `src/pages/WorkoutPlayer.tsx` | 移除内联 `style={{ transform }}` 避免与动画冲突；容器加 `will-change-transform` 类 |

### 具体改动

**tailwind.config.ts** — 修改 keyframe：
```js
"slide-in-up": {
  "0%": { transform: "translate3d(0, 100%, 0)" },
  "100%": { transform: "translate3d(0, 0, 0)" },
},
// animation 时长不变：0.35s ease-out
```

**WorkoutPlayer.tsx** — 容器：
```tsx
<div
  ref={containerRef}
  className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden animate-slide-in-up will-change-transform"
  // 移除 style={{ transform: "translate3d(0, 0, 0)" }}
>
```

核心改进：去掉入场时的 opacity 过渡（这是卡顿主因），用 `translate3d` 保持 GPU 合成，移除内联 style 与 CSS animation 的冲突。

