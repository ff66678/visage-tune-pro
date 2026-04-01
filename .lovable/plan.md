

## Plan: 修复返回时滚动位置丢失

### 根因

当用户从首页点击课程进入 `/course/:id` 时，React Router 会**卸载** `Index` 组件。组件内的 `useRef` 全部被销毁，`scrollPositions` 数据丢失。返回时 `Index` 重新挂载，refs 全部是初始空值，无法恢复滚动位置。

当前代码只能处理 tab 间切换的滚动保存，无法处理跨页面导航的场景。

### 修复方案

将滚动位置存储从 `useRef`（组件生命周期内）提升到**模块级变量**（组件外部），这样即使组件卸载重装，数据仍然保留。

**`src/pages/Index.tsx`**

1. 在组件外部声明 `const scrollPositions = new Map<number, number>()`
2. 组件挂载时，用 `requestAnimationFrame` 恢复当前 tab 的滚动位置（**无条件恢复**，不再判断 tab 是否变化）
3. scroll 事件监听保持不变，实时保存位置到模块级 Map
4. tab 切换时，先保存旧 tab 位置，再恢复新 tab 位置
5. 移除组件内的 `scrollPositions useRef`，改用模块级变量

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/Index.tsx` | 滚动位置存储从 useRef 提升到模块级变量；挂载时无条件恢复滚动位置 |

