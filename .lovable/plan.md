

## Plan: 切换页面时回到顶部

### 问题
当前 `scrollRef` 指向的容器没有设置固定高度，实际滚动可能发生在 `window` 层而非该 div，导致 `scrollTo(0,0)` 无效。

### 改动
**`src/pages/Index.tsx`**

在 `useEffect` 中同时滚动 `scrollRef` 和 `window`：
```tsx
useEffect(() => {
  scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}, [activeTab]);
```

同时给滚动容器加上 `h-screen` 使其成为真正的滚动容器，确保内部滚动生效。

