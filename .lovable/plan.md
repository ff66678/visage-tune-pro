

## 课程详情页顶部栏：初始透明 → 滚动渐显米色背景

### 用户意图澄清

用户要的是：**顶部容器（整条 bar）**初始无背景，滚动后才渐显米色背景。按钮本身的圆形背景保持不变。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` 第 105 行 | 容器背景根据 `scrolled` 切换：初始 `bg-transparent backdrop-blur-none` → 滚动后 `bg-background/85 backdrop-blur-xl` |

### 具体变更

第 105 行容器 className 改为：

```tsx
<div className={`fixed top-0 left-0 w-full px-6 pb-3 flex justify-between items-center z-20 transition-all duration-300 ${
  scrolled 
    ? 'pt-[max(1.5rem,env(safe-area-inset-top))] bg-background/85 backdrop-blur-xl' 
    : 'pt-[max(3rem,env(safe-area-inset-top))] bg-transparent backdrop-blur-none'
}`}>
```

按钮样式（第 106-117 行）不动，保留现有的 `bg-background/85 backdrop-blur-xl shadow-sm` 圆形背景。

