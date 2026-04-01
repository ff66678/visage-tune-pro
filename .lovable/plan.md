

## 修复切换导航栏和返回页面时的闪烁

### 根因

`animationClass` 初始值为 `""`（无动画），组件先渲染一帧无动画的内容，然后 `useEffect` 触发设置动画类，导致**第二帧**才开始动画。这个"先显示再动画"的过程就是闪烁的来源。

两种场景都受影响：
- **Tab 切换**：先渲染完整内容 → 再加 `animate-fade-in`（从 opacity:0 + translateY 开始）= 闪一下
- **子页面返回**：先渲染完整内容 → 再加 `animate-fade-in-opacity`（从 opacity:0 开始）= 闪一下

### 修复方案

改用 DOM 直接操作动画类，避免 React 状态更新导致的多帧渲染问题：

1. 移除 `animationClass` state
2. 用 `useRef` 引用动画包裹 div
3. 在 `useEffect` 中直接通过 `ref.current.classList` 添加/移除动画类
4. 初始渲染时 div 不带任何动画类（内容直接可见，无闪烁）
5. Tab 切换时：先设 `opacity:0`，再添加动画类让其淡入
6. 子页面返回时：不加任何动画，内容直接显示（配合滚动恢复即可，无需 opacity 过渡）

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 移除 `animationClass` state；用 ref + classList 控制动画；子页面返回不加动画避免闪烁 |

### 具体实现

```tsx
const animRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const el = animRef.current;
  if (!el) return;
  
  if (getIsTabSwitch()) {
    setIsTabSwitch(false);
    scrollPositions.delete(activeTab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    // 直接操作 DOM，同一帧内完成
    el.classList.remove("animate-fade-in-opacity");
    el.classList.add("animate-fade-in");
    const timer = setTimeout(() => el.classList.remove("animate-fade-in"), 450);
    return () => clearTimeout(timer);
  } else {
    // 子页面返回：不加动画，直接恢复滚动
    el.classList.remove("animate-fade-in", "animate-fade-in-opacity");
    const saved = scrollPositions.get(activeTab) || 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
      });
    });
  }
}, [activeTab]);

// 渲染
<div ref={animRef}>
  <ActivePage />
</div>
```

子页面返回时完全不加动画，内容直接出现 + 恢复滚动位置，体验最自然且不会闪烁。

