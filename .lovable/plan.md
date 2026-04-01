

## 修复：Tab 切换保留动画，子页面返回无动画

### 问题

当前 `animate-fade-in` 在每次组件挂载时都触发（包含 translateY(10px) 位移），子页面返回时产生抖动。但用户希望 tab 切换时保留入场动画。

### 方案

在 `Index.tsx` 中，用一个包裹 `div` 根据 `isTabSwitch` 标志来决定是否添加 `animate-fade-in`。同时从各页面组件自身移除 `animate-fade-in`，统一由 Index 控制。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 在 `<ActivePage />` 外包一层 div，根据 `isTabSwitch` 判断是否加 `animate-fade-in`；用 `useRef` 记录本次是否为 tab 切换 |
| `src/components/HomePage.tsx` | 根 div 移除 `animate-fade-in` |
| `src/components/LibraryPage.tsx` | 根 div 移除 `animate-fade-in` |
| `src/components/AnalysisPage.tsx` | 根 div 如有则移除 `animate-fade-in` |
| `src/components/ProgressPage.tsx` | 根 div 移除 `animate-fade-in` |

### 具体实现

**`src/pages/Index.tsx`**：
```tsx
const wasTabSwitch = useRef(false);

// 在 restore scroll 的 useEffect 中
useEffect(() => {
  if (getIsTabSwitch()) {
    wasTabSwitch.current = true;
    setIsTabSwitch(false);
    // ... 置顶逻辑
  } else {
    wasTabSwitch.current = false;
    // ... 恢复逻辑
  }
}, [activeTab]);

// 渲染
<div className={wasTabSwitch.current ? "animate-fade-in" : ""}>
  <ActivePage />
</div>
```

各页面组件只需删除根 div 上的 `animate-fade-in` 类，动画控制权统一交给 Index。

