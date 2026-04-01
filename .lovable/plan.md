

## 发现的 Bug 和逻辑问题

### Bug 1（严重）：引导页登录后被导航走，无法继续问卷

**问题**：Onboarding 组件在未登录时渲染 `<Auth showClose={false} />`。但 Auth 组件登录成功后会调用 `navigate(returnTo)`，而 `returnTo` 来自 URL 参数（`/onboarding` 没有 `returnTo` 参数），默认值是 `"/"`。结果用户登录后被导航到首页，**永远无法进入问卷**。

Google OAuth 同理：`redirect_uri` 带的 `returnTo=/`，登录后回到 `/auth?returnTo=/`，AuthRoute 检测到已登录直接跳到 `/`。

**修复**：给 Auth 组件添加 `onSuccess` 回调。当存在该回调时，登录成功后调用回调而非 `navigate`。Onboarding 中传入空回调（什么都不做），让组件自然 re-render 后显示问卷。

```tsx
// Auth.tsx
const Auth = ({ showClose = true, onSuccess }: { showClose?: boolean; onSuccess?: () => void }) => {
  // ...
  // 邮箱登录成功后：
  if (onSuccess) {
    onSuccess();
  } else {
    navigate(returnTo, { replace: true });
  }
  // Google OAuth redirect_uri 也需要处理：
  // 当 onSuccess 存在时，不传 returnTo 参数给 redirect_uri
};

// Onboarding.tsx
<Auth showClose={false} onSuccess={() => {}} />
```

### Bug 2（中等）：loading 状态下闪烁

**问题**：Onboarding 组件在 `loading` 为 true 时，两个 early return 都不触发（第366、371行），代码落到底部渲染问卷 UI，此时 `user` 为 null。虽然不会报错，但会出现短暂闪烁。

**修复**：在最前面加 loading 状态的加载动画：

```tsx
if (loading) {
  return <加载动画 />;
}
```

### Bug 3（轻微）：首页不强制未完成引导的用户去引导页

**问题**：`/` 路由是公开的，不经过 `ProtectedRoute`。所以登录但未完成引导的用户可以自由使用首页，只有访问受保护路由时才被强制跳转引导页。这可能是设计意图，但如果希望强制引导，需要在 Index 页面也加检查。

**建议**：确认这是否符合预期。如需强制，在 Index 组件中加一个判断。

### 改动汇总

**`src/pages/Auth.tsx`**
- 新增 `onSuccess?: () => void` prop
- 邮箱登录成功后，有 `onSuccess` 则调用它，否则 `navigate(returnTo)`
- Google OAuth 的 `redirect_uri`：当有 `onSuccess` 时不带 `returnTo`

**`src/pages/Onboarding.tsx`**
- `<Auth showClose={false} onSuccess={() => {}} />` 传入空回调
- 在 `loading` 为 true 时返回加载动画

