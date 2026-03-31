

## Plan: 登录后返回付费墙

### 问题根因

`AuthRoute`（App.tsx 第48行）在检测到用户已登录时，无条件重定向到 `/`，覆盖了 `returnTo` 参数。Google OAuth 登录后回到 `/auth?returnTo=...` 页面时，`AuthRoute` 先于 Auth 组件的逻辑执行，直接跳到首页。

### 改动

**1. `src/App.tsx` — `AuthRoute` 组件**

读取 URL 中的 `returnTo` 参数，登录后重定向到该路径：

```tsx
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user) {
    const returnTo = new URLSearchParams(location.search).get("returnTo") || "/";
    return <Navigate to={returnTo} replace />;
  }
  return <>{children}</>;
};
```

需要在已有 import 中加上 `useLocation`。

**2. `src/pages/Auth.tsx` — Google 登录 redirect_uri**

将 Google OAuth 的 `redirect_uri` 改为带上 `returnTo` 参数，确保 OAuth 回调后仍保留返回路径：

```tsx
const handleGoogleLogin = async () => {
  const { error } = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: `${window.location.origin}/auth?returnTo=${encodeURIComponent(returnTo)}`,
  });
};
```

### 流程验证
游客 → 课程页 → 付费墙 → 点订阅 → `/auth?returnTo=/course/xxx?showPaywall=true` → Google 登录 → OAuth 回调到 `/auth?returnTo=...` → `AuthRoute` 读取 `returnTo` → 重定向到 `/course/xxx?showPaywall=true` → 付费墙显示

