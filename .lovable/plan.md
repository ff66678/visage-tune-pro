

## Plan: 登录页移到引导页前面

### 当前流程
引导页问卷 → 加载动画 → 成功页 → **登录页** → 付费墙 → 完成

### 目标流程
**登录页** → 引导页问卷 → 加载动画 → 成功页 → 付费墙 → 完成

### 改动

**1. `src/pages/Onboarding.tsx`**

- 在组件顶部，渲染任何步骤之前，先检查 `user` 是否为空。如果未登录，直接渲染 `<Auth showClose={false} />`，不进入问卷流程。
- 删除 `handleSuccessNext` 中判断未登录显示 Auth 的分支，成功页之后直接进入付费墙（此时用户必定已登录）。
- 删除 `showAuth` 状态及相关的 `useEffect`（不再需要在中间步骤显示登录）。

**2. `src/App.tsx`**

- `/onboarding` 路由保持公开（不包在 `ProtectedRoute` 里），因为 Onboarding 组件自己处理登录逻辑。

### 技术细节

```
// Onboarding 组件内，在所有步骤渲染之前：
if (!loading && !user) {
  return <Auth showClose={false} />;
}

// handleSuccessNext 简化为：
const handleSuccessNext = () => {
  setShowSuccess(false);
  setShowPaywall(true);
};
```

