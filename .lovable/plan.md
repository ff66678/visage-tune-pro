

## 首页 PRO 按钮可重新打开付费墙

### 问题
`PaywallRoute` 中如果 `paywallCompleted === true` 会直接重定向到 `/`，导致用户从首页点击 PRO 按钮进入 `/paywall` 时被立刻弹回首页。

### 方案
去掉 `PaywallRoute` 中 `paywallCompleted` 的重定向逻辑。已完成付费墙的用户仍然可以访问 `/paywall` 查看订阅方案，只是在引导流程中不会被强制跳转到付费墙。

### 改动

**`src/App.tsx`**
- `PaywallRoute` 中删除 `if (paywallCompleted) return <Navigate to="/" replace />;` 这一行
- 保留未登录用户跳转到 `/onboarding` 的逻辑

涉及文件：`src/App.tsx`（1 行删除）

