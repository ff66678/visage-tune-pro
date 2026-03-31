

## Plan: 课程库头部滚动时收起，只保留筛选标签

### 思路
监听滚动容器的 scroll 事件，当用户向下滚动时，隐藏标题和搜索栏，只保留底部的筛选标签（全部、眼部、下颌...）。向上滚回顶部时恢复显示。

### 改动

**`src/components/LibraryPage.tsx`**

1. 添加 `scrolled` 状态，监听父容器滚动事件（通过 `useEffect` 监听最近的可滚动父容器）
2. 标题区域（`h1 课程库`）和搜索栏区域在 `scrolled` 为 true 时通过 `max-height: 0 + overflow: hidden + opacity: 0` 做过渡动画隐藏
3. 筛选标签区域始终显示
4. 使用 CSS transition 实现平滑收起效果

```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const container = document.querySelector('.no-scrollbar');
  if (!container) return;
  const onScroll = () => setScrolled(container.scrollTop > 20);
  container.addEventListener('scroll', onScroll);
  return () => container.removeEventListener('scroll', onScroll);
}, []);
```

标题和搜索栏包裹在一个 div 中，根据 `scrolled` 切换样式：
```tsx
<div className={`transition-all duration-300 overflow-hidden ${
  scrolled ? 'max-h-0 opacity-0 mb-0' : 'max-h-40 opacity-100 mb-4'
}`}>
  {/* 标题 */}
  {/* 搜索栏 */}
  {/* 排序选项 */}
</div>
```

header 的 `pt-8` 在滚动后改为 `pt-2` 减少顶部间距。

