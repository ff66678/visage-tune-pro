

## 子页面返回时添加从右往左滑出效果

### 方案

在子页面（CourseDetail、CategoryAll、Favorites、RecentlyPlayed 等）进入时从右滑入，返回时从右滑出。通过在 `App.tsx` 中添加一个路由过渡包装组件来实现，检测导航方向（push = 进入，pop = 返回）并应用对应动画。

### 改动

| 文件 | 改动 |
|---|---|
| `tailwind.config.ts` | 添加 `slide-in-right` 和 `slide-out-right` keyframes 及 animation（如果尚未存在） |
| `src/components/PageTransition.tsx` | 新建过渡包装组件，监听 `window.navigation` 或 `useNavigationType()` 判断方向，进入时加 `animate-slide-in-right`，使用 `popstate` 时播放滑出动画再导航 |
| `src/App.tsx` | 用 `PageTransition` 包裹子页面路由（CourseDetail、CategoryAll 等），主页 Index 不包裹 |

### 具体实现

**`PageTransition.tsx`**：
- 接收 `children`，用 `useNavigationType()` 从 react-router 获取导航类型
- `POP`（浏览器返回）= 播放 `slide-out-right` 动画（从左往右退出），动画结束后 `navigate(-1)`
- `PUSH`（正常跳转）= 播放 `slide-in-right`（从右往左进入）
- 用 ref 直接操作 classList 避免闪烁

**简化方案**：不拦截导航，只在子页面组件挂载时根据 `useNavigationType()` 决定入场动画：
- `PUSH` → `animate-slide-in-right`（从右滑入）
- `POP` → 不加动画（因为页面即将卸载，无法展示退出动画）

考虑到浏览器返回时旧页面已卸载、新页面（Index）正在挂载，**退出动画无法在旧页面上播放**。实际可行的做法是：

1. 子页面 `PUSH` 进入时：从右滑入
2. 返回到 Index 时（`POP`）：Index 的内容从左滑入（模拟"返回"感）

**最终方案**：

| 文件 | 改动 |
|---|---|
| `tailwind.config.ts` | 添加 `slide-in-left` keyframe：`translateX(-30%) → translateX(0)` + opacity |
| `src/pages/Index.tsx` | 子页面返回时（非 tab 切换），给 `animRef` 加 `animate-slide-in-left` 代替无动画 |
| 子页面（CourseDetail、CategoryAll 等） | 根 div 添加 `animate-slide-in-right` 入场动画 |

这样用户体验：进入子页面 → 内容从右滑入；按返回 → 主页内容从左滑入，形成完整的"推入/拉回"交互。

