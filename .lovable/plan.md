

## 导航切换自动回顶

在 `Index.tsx` 中，当 `activeTab` 变化时，将滚动容器 `scrollTop` 重置为 0。

### 实现
- 给内容容器加 `ref`
- 用 `useEffect` 监听 `activeTab`，变化时 `ref.current.scrollTop = 0`

### 涉及文件
- `src/pages/Index.tsx`

