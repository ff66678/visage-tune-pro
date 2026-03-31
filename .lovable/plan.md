

## Plan: 修复引导页重复显示的 Bug

### 问题分析
`/onboarding` 路由是公开的，没有检查用户是否已完成引导。当已登录用户（已完成引导）访问 `/onboarding` 时，会重新走一遍流程。同时 `ProtectedRoute` 在用户未登录时也会重定向到 `/onboarding`，这是正确的，但引导页本身缺少"已完成则跳过"的逻辑。

### 改动

**`src/pages/Onboarding.tsx`**

在 `Onboarding` 组件顶部添加检查逻辑：
- 从 `useAuth()` 取 `onboardingCompleted` 和 `loading`
- 如果用户已登录且 `onboardingCompleted === true`，直接 `<Navigate to="/" replace />`
- 这样已完成引导的用户无论何时访问 `/onboarding` 都会被跳转回首页

```tsx
const { user, setOnboardingCompleted, onboardingCompleted, loading } = useAuth();

// 已完成引导的用户直接跳转首页
if (!loading && user && onboardingCompleted === true) {
  return <Navigate to="/" replace />;
}
```

### 不变的部分
- 引导步骤内容、付费墙逻辑、数据库写入逻辑全部不变
- `ProtectedRoute` 逻辑不变

