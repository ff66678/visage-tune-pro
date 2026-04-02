

# iOS Google 登录：InAppBrowser + Lovable Managed Auth

## 问题根因

iOS 上 `lovable.auth.signInWithOAuth("google")` 会跳转到外部 Safari 完成 OAuth。Safari 的 localStorage 与 App WebView 不共享，导致 session 无法同步回 App。

## 解决方案

用 `@capacitor/browser`（SFSafariViewController）在 App 内打开 OAuth 流程，通过 **自定义 URL Scheme** 把 tokens 传回 App。

```text
App WebView                  InAppBrowser (SFSafariViewController)
    │                                │
    ├─ Browser.open(webAuthUrl) ────→│
    │                                ├─ 自动触发 lovable OAuth
    │                                ├─ 用户在 Google 登录
    │                                ├─ OAuth 回调，拿到 tokens
    │                                ├─ redirect → customscheme://callback?tokens=...
    │                                │
    ├─ appUrlOpen 事件触发 ←──────────┘
    ├─ 解析 tokens
    ├─ supabase.auth.setSession(tokens)
    ├─ Browser.close()
    └─ 登录完成 ✅
```

## 代码改动

### 1. 安装依赖
- `@capacitor/browser`
- `@capacitor/app`

### 2. 新建 `src/pages/OAuthCallback.tsx`

一个轻量页面，职责：
- 页面加载时自动调用 `lovable.auth.signInWithOAuth("google", { redirect_uri: 当前页URL })`
- 首次调用→重定向到 Google（在 InAppBrowser 内完成）
- 回调后再次加载→ `lovableAuth` 返回 tokens
- 检测 URL 中 `returnScheme` 参数，将 tokens 拼接到自定义 URL Scheme 并 `window.location.href` 跳转

### 3. 在 `src/App.tsx` 添加路由

- `/oauth-native-callback` → `OAuthCallback` 组件（无需 AuthRoute 包裹）

### 4. 修改 `src/pages/Auth.tsx` 的 `handleGoogleLogin`

```typescript
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";

const handleGoogleLogin = async () => {
  if (Capacitor.isNativePlatform()) {
    const scheme = "app.lovable.faceyoga";
    const webOrigin = "https://a760e783-0c5e-4cc7-bc79-1683400b12d2.lovableproject.com";
    const callbackUrl = `${webOrigin}/oauth-native-callback?returnScheme=${scheme}`;
    
    // 监听自定义 URL Scheme 回调
    const listener = await CapApp.addListener("appUrlOpen", async ({ url }) => {
      const params = new URL(url).searchParams;
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        await Browser.close();
        listener.remove();
        toast.success(t("auth.loginSuccess"));
        navigate(returnTo, { replace: true });
      }
    });
    
    // 在 InAppBrowser 中打开 OAuth 流程
    await Browser.open({ url: callbackUrl });
  } else {
    // Web 端保持原逻辑
    const redirectUri = `${window.location.origin}/auth?returnTo=${encodeURIComponent(returnTo)}`;
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectUri });
    if (error) toast.error("Google login failed");
  }
};
```

### 5. `OAuthCallback.tsx` 核心逻辑

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const returnScheme = params.get("returnScheme");
  
  const doAuth = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + window.location.pathname + "?returnScheme=" + returnScheme,
    });
    
    if (result.redirected) return; // 第一次：跳转到 Google
    
    if (!result.error && result.tokens) {
      // 第二次（回调）：拿到 tokens，跳转回 App
      const { access_token, refresh_token } = result.tokens;
      window.location.href = `${returnScheme}://callback?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
    }
  };
  
  if (returnScheme) doAuth();
}, []);
```

## 用户操作（Xcode 端）

完成代码后，你需要在 Xcode 中：

1. **添加 URL Scheme**: Target → Info → URL Types → 添加 `app.lovable.faceyoga`
2. `git pull` → `npx cap sync ios`
3. 真机运行测试

## 不改动的部分

- Lovable Managed Auth 架构不变
- `src/integrations/lovable/index.ts` 不修改（自动生成文件）
- Web 端 Google 登录逻辑完全不变
- 邮箱登录不受影响

