

## 修复首页返回时顶部栏"跳下"问题

### 根因

`HomePage` 中 `scrolled` 初始值为 `false`，导致顶部栏以 `pt-8`（大间距）渲染。之后 Index 恢复滚动位置 → 触发 scroll 事件 → `scrolled` 变为 `true` → 顶部栏缩为 `pt-3`。这个先大后小的过程就是用户看到的"跳下"。

### 修复方案

在 `HomePage` 初始化 `scrolled` 时，直接读取当前 `scrollRef` 的 `scrollTop`，而不是固定写 `false`。

### 改动

| 文件 | 改动 |
|---|---|
| `src/components/HomePage.tsx` 第 25 行 | `useState(false)` → `useState(() => { ... })` 用惰性初始化，读取 `scrollContainerRef` 当前 scrollTop |

由于 `scrollContainerRef` 在 `useState` 初始化时还不可用（hooks 顺序问题），改为在第 30-37 行的 `useEffect` 中确保 **同步** 读取初始滚动位置：

```tsx
const [scrolled, setScrolled] = useState(false);
const scrollContainerRef = useScrollContainer();

// 关键：用 useLayoutEffect 替代 useEffect，在渲染前同步读取滚动位置
useLayoutEffect(() => {
  const el = scrollContainerRef?.current;
  if (!el) return;
  setScrolled(el.scrollTop > 20);
}, [scrollContainerRef]);

useEffect(() => {
  const el = scrollContainerRef?.current;
  if (!el) return;
  const onScroll = () => setScrolled(el.scrollTop > 20);
  el.addEventListener("scroll", onScroll, { passive: true });
  return () => el.removeEventListener("scroll", onScroll);
}, [scrollContainerRef]);
```

但更根本的问题是：Index 的滚动恢复（第 59-60 行）在 `useEffect` 中执行，晚于 HomePage 的渲染。所以即使用 `useLayoutEffect`，首次渲染时 scrollTop 仍为 0。

**真正的修复**：在 Index.tsx 中，将滚动恢复逻辑从 `useEffect` 提前到 `useLayoutEffect`，确保在浏览器绘制前就恢复滚动位置，这样 HomePage 的 `useLayoutEffect` 读到的就是正确的 scrollTop。

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` 第 1 行 | import 加入 `useLayoutEffect` |
| `src/pages/Index.tsx` 第 35 行 | 滚动恢复的 `useEffect` → `useLayoutEffect`，确保绘制前恢复位置 |
| `src/components/HomePage.tsx` 第 1 行 | import 加入 `useLayoutEffect` |
| `src/components/HomePage.tsx` 第 25-37 行 | 拆分为：`useLayoutEffect` 同步初始化 `scrolled` + `useEffect` 注册持续监听 |

同样的修复也应用于 `AnalysisPage.tsx` 和 `ProgressPage.tsx`（如果它们有类似的 scrolled 状态）。

