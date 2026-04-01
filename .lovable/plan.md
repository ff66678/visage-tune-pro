

## Plan: 返回时恢复滚动位置

### 问题

当前 `Index.tsx` 的 `useEffect` 在 `activeTab` 变化时**无条件置顶**。用户从首页点击课程进入详情页，返回后滚动位置丢失，总是回到顶部。

### 方案

在离开 Index 页面前保存滚动位置，返回时恢复。

**1. `src/pages/Index.tsx`**

- 用 `useRef` 保存每个 tab 的滚动位置（`Map<number, number>`）
- 监听 `scrollRef` 的 `scroll` 事件，实时记录当前 tab 的滚动位置
- 将 `useEffect` 中的置顶逻辑改为：切换 tab 时恢复该 tab 之前保存的位置（如果有），否则置顶
- 关键：**仅在 tab 切换时**恢复/置顶，从子页面返回时不触发置顶

具体做法：
- 添加 `prevTabRef` 跟踪上一个 tab 值
- 当 `activeTab` 变化且 `prevTabRef.current !== activeTab` 时，保存旧 tab 的滚动位置，恢复新 tab 的滚动位置
- 当 `activeTab` 未变化（即从子页面返回）时，不做任何滚动操作，浏览器/React 会自然保留位置

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 添加 scroll 位置保存/恢复逻辑，移除无条件置顶 |

