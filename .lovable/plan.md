

## 修复课程库返回时页面跳动

### 根因

当从 CategoryAll 返回到课程库 tab 时：

1. `Index` 组件重新挂载，`LibraryPage` 也重新挂载
2. `scrolled` 状态初始值为 `false` → 标题栏和搜索框**完整显示**
3. 页面先以 scroll=0 渲染（标题完整展开）
4. `requestAnimationFrame` 恢复滚动位置（比如 500px）
5. scroll 事件触发，`scrolled` 变为 `true` → 标题栏**折叠隐藏**

第3→5步的切换导致了可见的"跳动"：标题栏先展开再折叠。

### 修复方案

让 `scrolled` 的初始值基于模块级保存的滚动位置，这样组件首次渲染就使用正确的折叠状态，避免闪跳。

### 改动

| 文件 | 改动 |
|---|---|
| `src/components/LibraryPage.tsx` | 将 `scrolled` 初始值从 `false` 改为根据 `scrollPositions.get(1) > 20` 计算；从 Index.tsx 导出 `scrollPositions` |
| `src/pages/Index.tsx` | 导出 `scrollPositions` 供 LibraryPage 使用 |

具体做法：
- `Index.tsx`：`export const scrollPositions = new Map<number, number>();`（加 export）
- `LibraryPage.tsx`：`import { scrollPositions } from "@/pages/Index";`，然后 `const [scrolled, setScrolled] = useState((scrollPositions.get(1) || 0) > 20);`

这样返回时 LibraryPage 首次渲染就知道该折叠还是展开标题栏，不会闪跳。

