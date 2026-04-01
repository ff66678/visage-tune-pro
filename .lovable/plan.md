

## 修复课程库返回时的跳动

### 根因

`scrolled` 的初始值已正确基于保存的滚动位置计算，但 header 的 CSS 设置了 `transition-all duration-500 ease-in-out`。当组件挂载时，虽然 `scrolled=true`，但 CSS 过渡动画仍会从初始布局状态（未折叠）**动画到**折叠状态，耗时 500ms，这就是可见的"跳动"。

此外，`requestAnimationFrame` 恢复滚动位置也可能在第一帧渲染后才执行，造成短暂的位置不一致。

### 修复方案

在 `LibraryPage` 中添加一个 `mounted` ref，初始为 `false`，挂载后通过 `useEffect` 设为 `true`。在 header 和可折叠区域的 `className`/`style` 中，当 `mounted` 为 `false` 时不添加 `transition` 类，避免首次渲染时的过渡动画。

同时在 `Index.tsx` 中，将 `requestAnimationFrame` 改为双层嵌套（确保 DOM 完全就绪后再恢复滚动）。

### 改动

| 文件 | 改动 |
|---|---|
| `src/components/LibraryPage.tsx` | 添加 `mounted` ref，首次渲染禁用 transition；挂载后启用 |
| `src/pages/Index.tsx` | 双层 `requestAnimationFrame` 确保滚动恢复时机更准确 |

