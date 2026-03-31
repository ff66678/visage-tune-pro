

## Plan: 修复移动端输入框聚焦时页面缩放问题

### 问题
iOS Safari 在聚焦 `font-size` 小于 16px 的输入框时会自动缩放页面。当前搜索框使用 `text-sm`（14px），触发了这个行为。

### 改动

**1. `src/components/LibraryPage.tsx`**

搜索框 input 的 className 中将 `text-sm` 改为 `text-base`（16px），防止 iOS 自动缩放。

**2. `index.html`**

在 viewport meta 标签中添加 `maximum-scale=1`，作为全局防缩放保险：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
```

这两处改动配合使用，彻底解决输入框聚焦缩放问题。

