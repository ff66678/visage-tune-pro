

## 课程详情页顶部改为米色背景 + 滚动交互

### 改动概述

1. **顶部栏背景色**：从 `bg-gradient-to-b from-black/40 to-transparent` 改为 `bg-background/85 backdrop-blur-xl`（与首页一致的米色半透明）
2. **按钮背景色**：从 `bg-card/85` 改为 `bg-background/85`（统一米色调）
3. **滚动交互**：添加与首页相同的滚动收缩逻辑 — 监听内容区 `scrollTop`，滚动超过 20px 时 `pt` 从大变小，平滑过渡

### 技术细节

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 添加 scrolled state + scroll 监听；顶部 portal 样式改为米色 + 收缩交互 |

**具体变更：**

1. 添加 `scrolled` state 和 ref 监听内容区滚动：
```tsx
const [scrolled, setScrolled] = useState(false);
const contentRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const el = contentRef.current;
  if (!el) return;
  const onScroll = () => setScrolled(el.scrollTop > 20);
  el.addEventListener("scroll", onScroll, { passive: true });
  return () => el.removeEventListener("scroll", onScroll);
}, []);
```

2. 顶部 portal 样式更新：
```tsx
<div className={`fixed top-0 left-0 w-full px-6 pb-3 flex justify-between items-center z-20 bg-background/85 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'pt-[max(1.5rem,env(safe-area-inset-top))]' : 'pt-[max(3rem,env(safe-area-inset-top))]'}`}>
```

3. 按钮背景统一改为 `bg-background/85`

