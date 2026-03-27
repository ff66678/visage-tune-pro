

## Capacitor iOS 原生应用配置计划

### 概述
将当前 Web 应用通过 Capacitor 打包成 iOS 原生应用，使其可以上架 Apple App Store。

### 步骤

**1. 安装 Capacitor 依赖**
- 添加 `@capacitor/core`、`@capacitor/ios`、`@capacitor/android` 到 dependencies
- 添加 `@capacitor/cli` 到 devDependencies

**2. 初始化 Capacitor 配置**
- 在项目根目录创建 `capacitor.config.ts`：
  - `appId`: `app.lovable.a760e7830c5e4cc7bc791683400b12d2`
  - `appName`: `visage-tune-pro`
  - `webDir`: `dist`（Vite 构建输出目录）
  - 配置 `server.url` 指向沙盒预览地址以支持热更新调试

**3. 本地构建与运行（需要你在自己电脑上操作）**

完成代码配置后，你需要在本地执行以下步骤：

1. 通过 Lovable 编辑器的 **Export to GitHub** 按钮将项目导出到你的 GitHub 仓库
2. 在本地 `git clone` 或 `git pull` 项目
3. 运行 `npm install`
4. 运行 `npx cap add ios` 添加 iOS 平台
5. 运行 `npm run build && npx cap sync` 同步 Web 资源到原生项目
6. 运行 `npx cap open ios` 在 Xcode 中打开项目
7. 在 Xcode 中配置签名证书，然后构建并运行

### 前提条件
- **Mac 电脑** + 安装 **Xcode**
- **Apple 开发者账号**（$99/年），用于签名和上架
- 如需真机调试，需要一台 iPhone

### 参考资料
配置完成后，建议阅读 Lovable 官方博客了解更多 Capacitor 开发细节：[Lovable Mobile Development Guide](https://docs.lovable.dev)

