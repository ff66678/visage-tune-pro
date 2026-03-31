

## Plan: 退出登录后不再显示引导页

### 问题
`ProtectedRoute` 中，未登录用户被重定向到 `/onboarding`（第33行）。退出后用户变为未登录状态，所以访问任何受保护页面都会跳到引导页。

### 改动

**`src/App.tsx`**

将 `ProtectedRoute` 中未登录用户的重定向目标从 `/onboarding` 改为 `/auth`：

```tsx
if (!user) return <Navigate to="/auth" replace />;
```

这样退出登录后会跳转到登录页，而不是引导页。新用户注册登录后，如果 `onboardingCompleted === false`，仍会被引导到 `/onboarding`（第41行逻辑不变）。

