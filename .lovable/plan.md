

## Plan: 首页无需登录 + 头像点击登录

### 思路
让首页（及课程库等页面）在未登录状态下也能浏览，点击头像时判断登录状态：已登录跳个人页，未登录跳登录页。

### 改动

**1. `src/App.tsx` — 首页路由改为公开**

将 `/` 路由从 `ProtectedRoute` 包裹改为直接渲染 `<Index />`，让未登录用户也能看到首页。其他需要用户数据的页面（如 profile、favorites 等）保持 `ProtectedRoute`。

```tsx
<Route path="/" element={<Index />} />
```

同时可考虑将 `/category/:category` 和 `/course/:id` 也改为公开，让用户能浏览课程内容。

**2. `src/components/HomePage.tsx` — 头像点击逻辑**

修改头像 `onClick`：
- 已登录 (`user` 存在) → 跳转 `/profile`
- 未登录 → 跳转 `/auth`

未登录时显示默认头像和"游客"名称，隐藏需要登录才有意义的元素（如会员按钮等可保留引导付费）。

```tsx
const handleAvatarClick = () => {
  if (user) {
    navigate("/profile");
  } else {
    navigate("/auth");
  }
};

const displayName = user 
  ? (profile?.display_name || user.email?.split("@")[0] || "用户")
  : "游客";
```

**3. `src/contexts/AuthContext.tsx` — 兼容未登录状态**

当前 hooks（`useProfile`、`useWorkoutLogs` 等）在未登录时可能报错。需确保这些 hooks 在 `user` 为 null 时跳过查询（大多数已通过 `enabled: !!user` 控制，需验证）。

**4. 其他页面 tabs（课程库、分析、记录）**

在 `BottomTabBar` 点击分析/记录 tab 时，若未登录则提示登录（toast 提示或跳转 `/auth`），而首页和课程库 tab 允许自由浏览。

### 不变的部分
- 登录/注册页面逻辑不变
- 引导页逻辑不变
- 数据库和 RLS 不变

