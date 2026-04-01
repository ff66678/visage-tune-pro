

## 修复底部按钮为 fixed 定位 + safe area 适配

### 问题

当前按钮用 `absolute bottom-0`，在 `SwipeBack` 容器内定位。由于容器有 `overflow-hidden`，按钮在某些情况下可能被遮挡或不随视口固定。需要改为 `fixed` 并适配 iPhone safe area。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 按钮容器改为 `fixed`，添加 safe area padding；内容区添加底部 padding 防遮挡 |

### 具体变更

**1. 按钮容器**（第 182 行）：
```tsx
// 从
<div className="absolute bottom-0 left-0 w-full bg-card/85 backdrop-blur-xl px-6 pt-4 pb-8 z-30">

// 改为
<div className="fixed bottom-0 left-0 w-full bg-card/85 backdrop-blur-xl px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] z-30">
```

- `fixed` 确保始终固定在屏幕底部
- `pb-[max(2rem,env(safe-area-inset-bottom))]` 在 iPhone 上用 safe area inset，普通设备最少 2rem

**2. 内容滚动区**（第 108 行）：
```tsx
// 从
<div className="flex-1 overflow-y-auto pb-32 no-scrollbar">

// 改为
<div className="flex-1 overflow-y-auto pb-36 no-scrollbar">
```

增加底部 padding 防止内容被按钮遮挡（`pb-36` = 9rem，足够覆盖按钮高度 + safe area）。

