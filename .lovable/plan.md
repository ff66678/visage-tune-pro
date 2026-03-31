

## Plan: 分析和记录页面允许未登录用户浏览

### 改动

**1. `src/components/BottomTabBar.tsx`**

将分析和记录 tab 的 `requiresAuth` 改为 `false`，让未登录用户也能切换到这两个页面：

```tsx
{ icon: ScanFace, label: "分析", requiresAuth: false },
{ icon: Camera, label: "记录", requiresAuth: false },
```

**2. `src/components/AnalysisPage.tsx`**

- 拍照按钮（`fileInputRef.current?.click()`）：点击前检查 `user`，未登录跳 `/auth`
- 推荐课程点击（`navigate(/course/...)`）：未登录跳 `/auth`
- 推荐商品链接：未登录跳 `/auth`（阻止默认跳转）
- 页面内容本身正常展示（无照片的空状态、历史分析结果等照常显示）

**3. `src/components/ProgressPage.tsx`**

- 拍照上传按钮：点击前检查 `user`，未登录跳 `/auth`
- 页面布局和日历等 UI 正常展示

两个页面都需要从 `useAuth()` 获取 `user`。

### 不变的部分
- 已登录用户体验完全不变
- 数据查询 hooks 在无用户时返回空数据，页面自然显示空状态

