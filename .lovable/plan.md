

## 解耦个人资料页与底部分析Tab

### 问题
`ProfileDetail`（头像点进去的页面）和底部 Tab 第三个页面共用同一个 `ProfilePage` 组件。未来底部 Tab 要换成别的内容，会影响头像页面。

### 方案
1. **复制 `ProfilePage.tsx` → 新建 `ProfileDetailContent.tsx`**：将当前 `ProfilePage` 的完整内容复制为独立组件，专门给 `/profile` 路由使用。这样两个页面完全独立，互不影响。

2. **更新 `ProfileDetail.tsx`**：引用新的 `ProfileDetailContent` 替代 `ProfilePage`。

3. **底部 Tab 的 `ProfilePage.tsx` 保持不变**：之后你可以随意替换底部 Tab 的内容，不会影响头像进入的个人页面。

### 涉及文件
- `src/components/ProfileDetailContent.tsx`（新建，从 ProfilePage 复制独立出来）
- `src/pages/ProfileDetail.tsx`（改为引用 ProfileDetailContent）

