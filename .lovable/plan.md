

## 引导页和付费墙只跑一次

### 当前问题
- `onboarding_completed` 已存在于 profiles 表，但 `/onboarding` 路由没有检查该状态——已完成的用户仍可进入引导页重走一遍
- 付费墙没有独立的完成状态，它的完成与 `onboarding_completed` 绑定在一起。如果用户中途退出（完成了引导但没点付费墙的按钮），下次回来会从引导页重新开始
- `/paywall` 路由也没有记忆，每次访问都会展示

### 方案
在 profiles 表新增 `paywall_completed` 字段，分别追踪引导和付费墙的完成状态。路由层面增加状态检查，已完成的用户直接跳过。

### 实施步骤

**1. 数据库迁移：profiles 表新增 `paywall_completed` 字段**
```sql
ALTER TABLE public.profiles ADD COLUMN paywall_completed boolean NOT NULL DEFAULT false;
```

**2. 修改 `AuthContext.tsx`**
- 同时获取 `onboarding_completed` 和 `paywall_completed`
- 新增 `paywallCompleted` 状态和 `setPaywallCompleted` 方法暴露给全局

**3. 修改 `Onboarding.tsx`**
- 组件顶部检查：如果 `onboardingCompleted === true`，直接跳转到首页（或付费墙）
- `completeOnboarding` 拆分为两步：引导完成时只写 `onboarding_completed = true`
- 付费墙关闭时写 `paywall_completed = true`

**4. 修改 `App.tsx` 路由逻辑**
- `ProtectedRoute` 增加 `paywallCompleted` 检查：已登录 + 引导完成但付费墙未完成 → 跳转 `/paywall`
- `/onboarding` 路由：已登录且引导完成的用户自动重定向到 `/` 或 `/paywall`
- `/paywall` 路由：`paywallCompleted === true` 时直接重定向到 `/`

**5. 修改 `Paywall.tsx`**
- 点击"开始免费试用"时，写入 `paywall_completed = true` 到数据库并更新 context

### 涉及文件
- `supabase/migrations/` — 新增迁移文件
- `src/contexts/AuthContext.tsx` — 新增 paywall 状态
- `src/pages/Onboarding.tsx` — 增加已完成检查
- `src/pages/Paywall.tsx` — 持久化付费墙完成状态
- `src/App.tsx` — 路由守卫增加 paywall 检查

