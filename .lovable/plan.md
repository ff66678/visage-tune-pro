

## 课程详情页顶部栏：初始透明 → 滚动渐显米色背景

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 顶部 portal 容器和按钮初始无背景，滚动后渐变为米色背景 |

### 具体变更

**顶部 portal 容器**（第 105 行）：
- 初始状态：无背景色、无 blur（只有三个按钮悬浮在封面图上）
- 滚动后（`scrolled = true`）：渐显 `bg-background/85 backdrop-blur-xl`

```tsx
<div className={`fixed top-0 left-0 w-full px-6 pb-3 flex justify-between items-center z-20 transition-all duration-300 ${
  scrolled 
    ? 'pt-[max(1.5rem,env(safe-area-inset-top))] bg-background/85 backdrop-blur-xl' 
    : 'pt-[max(3rem,env(safe-area-inset-top))] bg-transparent backdrop-blur-none'
}`}>
```

**按钮样式**（第 106-113 行）：
- 初始状态按钮保留圆形 `bg-background/85 backdrop-blur-xl shadow-sm`（让按钮本身在封面图上可见）
- 按钮样式不变，只是容器背景从透明过渡到米色

