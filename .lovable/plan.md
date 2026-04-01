

## 顶部按钮固定悬浮 — 使用 Portal

### 问题
与底部按钮同理，SwipeBack 的 `transform` 会让 `fixed` 失效。顶部按钮目前用 `absolute top-12`，滚动时会跟着内容走。

### 方案
将顶部按钮区域也用 `createPortal` 渲染到 `document.body`，改为 `fixed` 定位 + safe area 适配。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 顶部按钮区域用 `createPortal` 包裹，改 `fixed` 定位 |

### 具体变更

**第 94-107 行**（顶部按钮区域）：

```tsx
// 从 SwipeBack 内部移出，用 portal 渲染
{createPortal(
  <div className="fixed top-0 left-0 w-full px-6 pt-[max(3rem,env(safe-area-inset-top))] flex justify-between items-center z-20">
    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-card/85 backdrop-blur-xl flex items-center justify-center text-foreground shadow-sm">
      <ChevronLeft className="w-5 h-5" />
    </button>
    <div className="flex gap-3">
      {/* 分享 + 收藏按钮保持不变 */}
    </div>
  </div>,
  document.body
)}
```

- `fixed top-0` 固定在视口顶部
- `pt-[max(3rem,env(safe-area-inset-top))]` 适配 iPhone 刘海/状态栏
- 无背景色，保持悬浮在封面图上的透明效果
- 按钮样式（圆形磨砂玻璃）完全不变

