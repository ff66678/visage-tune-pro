

## 修复 "开始训练" 按钮在滚动时不固定的问题

### 根因

`SwipeBack` 组件对容器应用了 `transform: translate3d(0, 0, 0)`（第 75 行），CSS 规范中 **transform 会创建新的包含块**，导致内部的 `position: fixed` 元素相对于该容器定位而非视口，按钮因此跟随内容滚动。

### 方案

用 React Portal 将按钮渲染到 `document.body`，绕过 SwipeBack 的 transform 包含块限制。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 将底部按钮区域用 `createPortal` 渲染到 `document.body` |

### 具体变更

**CourseDetail.tsx**：

1. 顶部添加 `import { createPortal } from "react-dom"`
2. 将第 182-187 行的按钮 div 用 portal 包裹：

```tsx
{createPortal(
  <div className="fixed bottom-0 left-0 w-full bg-card/85 backdrop-blur-xl px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] z-30">
    <button onClick={handleStartWorkout}
      className="w-full h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
      <Play className="w-5 h-5 fill-current" />{t("course.startWorkout")}
    </button>
  </div>,
  document.body
)}
```

3. 内容区 `pb-36` 保持不变，确保底部留白

这样按钮直接挂载到 body 上，`fixed` 定位相对于视口生效，不受 SwipeBack 的 transform 影响。

