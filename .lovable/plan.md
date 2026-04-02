

# 集成 iOS 原生 Google 登录

## 前置准备（你需要做的）

在 **Google Cloud Console** (https://console.cloud.google.com) 中操作：

### 第一步：创建 iOS OAuth Client ID

1. 打开 **APIs & Services → Credentials**
2. 点击 **Create Credentials → OAuth client ID**
3. Application type 选 **iOS**
4. Bundle ID 填写：`app.lovable.a760e7830c5e4cc7bc791683400b12d2`
5. 创建后记下 **iOS Client ID**（格式：`xxx.apps.googleusercontent.com`）

### 第二步：确认 Web Client ID

1. 在同一个 Credentials 页面，找到已有的 **Web application** 类型的 OAuth Client ID
2. 如果没有，创建一个，Authorized redirect URIs 添加你的 Lovable Cloud 回调 URL
3. 记下 **Web Client ID**

### 第三步：配置 Xcode

1. 将 iOS Client ID 的反转格式（如 `com.googleusercontent.apps.xxx`）添加为 URL Scheme
2. 在 Xcode → Target → Info → URL Types 中添加

---

## 代码实现计划

拿到两个 Client ID 后，我会做以下改动：

### 1. 安装依赖
- 添加 `@codetrix-studio/capacitor-google-auth` 到 `package.json`

### 2. 修改 `capacitor.config.ts`
- 添加 GoogleAuth 插件配置（clientId、iosClientId、scopes）

### 3. 修改 `src/pages/Auth.tsx`
- 用 `Capacitor.getPlatform()` 判断运行环境
- **Web 端**：继续使用 `lovable.auth.signInWithOAuth("google")`
- **iOS/Android 端**：调用 `GoogleAuth.signIn()` 获取 `idToken`，然后用 `supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })` 完成登录

```text
用户点击 Google 登录
       │
       ├─ Web ──→ lovable.auth.signInWithOAuth("google")
       │
       └─ iOS ──→ GoogleAuth.signIn()
                    │
                    └─→ 拿到 idToken
                         │
                         └─→ supabase.auth.signInWithIdToken()
                              │
                              └─→ 登录成功，navigate(returnTo)
```

---

**请先完成上面的 Google Cloud Console 配置，然后把 iOS Client ID 和 Web Client ID 发给我，我就开始写代码。**

