

## Plan: 付费墙打开时自动滚动到顶部

### 问题
从课程详情页跳转到付费墙时，页面可能保持在之前的滚动位置，导致付费墙内容没有从顶部开始显示。

### 改动

**`src/pages/Paywall.tsx`**

在组件挂载时添加 `useEffect`，调用 `window.scrollTo(0, 0)` 将页面滚动到顶部：

```tsx
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
```

一行代码，确保每次付费墙显示时内容从顶部开始。

