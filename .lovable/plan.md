

## 增强顶部按钮对比度 — 添加 backdrop-blur

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 顶部 portal div 添加 `backdrop-blur-sm`，让按钮后方内容模糊化 |

### 具体变更

顶部 portal 容器 class 添加 `backdrop-blur-sm`：

```tsx
<div className="fixed top-0 left-0 w-full px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-3 flex justify-between items-center z-20 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm">
```

`backdrop-blur-sm`（4px 模糊）让滚动到按钮后方的文字内容变模糊，提升按钮的视觉层次和可读性，同时不影响整体美观。

