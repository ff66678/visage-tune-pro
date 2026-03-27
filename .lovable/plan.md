

## 引导流程仅展示一次

### 问题
`/onboarding` 是公开路由，已完成引导的用户仍可再次访问。

### 方案
在 `Onboarding` 组件顶部加判断：如果用户已登录且 `onboardingCompleted === true`，直接重定向到首页。

### 改动

**`src/pages/Onboarding.tsx`**
- 从 `useAuth` 取出 `onboardingCompleted` 和 `loading`
- 在组件顶部（所有条件渲染之前）添加：若 `user && onboardingCompleted === true`，返回 `<Navigate to="/" replace />`
- 加载中时显示 spinner

