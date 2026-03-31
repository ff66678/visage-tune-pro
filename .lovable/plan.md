

## Plan: 优化课程库头部收起动画，使过渡更丝滑

### 问题
当前使用 `max-h-0` / `max-h-40` + `opacity` 切换，过渡生硬，因为 `max-height` 动画不精确（估算值与实际高度不匹配导致速度不均匀）。

### 改动

**`src/components/LibraryPage.tsx`**

1. **用 `useRef` 获取实际高度**：给可折叠区域加 ref，用 `scrollHeight` 作为 `max-height` 的目标值，让动画与实际内容高度匹配
2. **缓动函数改为 `ease-in-out`**：比 `ease-out` 更自然
3. **延长动画时长**：从 `duration-300` 改为 `duration-500`
4. **加 `transform` 微位移**：收起时加 `translateY(-8px)`，展开时 `translateY(0)`，增加层次感
5. **header padding 过渡时长同步**：统一为 `duration-500 ease-in-out`

具体样式改为：
```tsx
// 可折叠区域
<div 
  ref={collapseRef}
  className="overflow-hidden transition-all duration-500 ease-in-out"
  style={{
    maxHeight: scrolled ? 0 : collapseRef.current?.scrollHeight || 200,
    opacity: scrolled ? 0 : 1,
    transform: scrolled ? 'translateY(-8px)' : 'translateY(0)',
    marginBottom: scrolled ? 0 : 16,
  }}
>
```

header 整体：
```tsx
<header className={`... transition-all duration-500 ease-in-out ${scrolled ? 'pt-2 pb-1' : 'pt-8 pb-2'}`}>
```

### 不变的部分
- 滚动监听逻辑不变
- 筛选标签、内容区域不变

