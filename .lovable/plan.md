

## Plan: 添加 PWA 可安装功能（仅安装到桌面，无离线支持）

### 思路
不使用 Service Worker，只添加 `manifest.json` + 移动端 meta 标签，让用户可以通过浏览器"添加到主屏幕"把应用像原生 App 一样打开。

### 改动

**1. 创建 `public/manifest.json`**

```json
{
  "name": "Visage Tune Pro",
  "short_name": "Visage",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/placeholder.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "/placeholder.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

**2. 更新 `index.html`**

在 `<head>` 中添加：
- `<link rel="manifest" href="/manifest.json">`
- `<meta name="theme-color" content="#000000">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<link rel="apple-touch-icon" href="/placeholder.svg">`

同时把 `<title>` 改为 "Visage Tune Pro"。

### 说明
- 不涉及 `vite-plugin-pwa`，不注册 Service Worker，不会影响编辑器预览
- PWA 安装功能仅在发布后的正式域名生效（需 HTTPS）
- 后续可替换 `placeholder.svg` 为正式 App 图标（建议提供 192x192 和 512x512 的 PNG）

