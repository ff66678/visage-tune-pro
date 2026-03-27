

## 修复返回按钮：回到上一个标签页而非总是首页

### 问题
当前三个标签（首页、库、分析）共用 `/` 路由，活动标签仅靠 `useState(0)` 管理。从"库"标签点进课程详情后按返回，虽然浏览器回到了 `/`，但 `activeTab` 状态重置为 `0`，始终显示首页。

### 方案
用 URL search params（`?tab=1`）持久化当前标签，这样浏览器后退时自动恢复到正确的标签页。

### 实施步骤

**1. 改造 `src/pages/Index.tsx`**
- 用 `useSearchParams` 读取和写入 `tab` 参数
- `activeTab` 从 URL 参数派生，默认为 `0`
- `onTabChange` 时调用 `setSearchParams({ tab: ... }, { replace: true })`

**2. 更新 `HomePage.tsx` 和 `LibraryPage.tsx` 的导航链接**
- 课程跳转保持不变（`/course/:id`），不需要修改
- 浏览器后退会自动恢复到带 `?tab=X` 的 URL

### 技术细节
- 使用 `react-router-dom` 的 `useSearchParams`
- `replace: true` 避免切换标签时产生多余的历史记录
- 改动范围仅 `Index.tsx`，约 5 行代码

