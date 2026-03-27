

## 首页头像和名字真实化

### 改动
修改 `src/components/HomePage.tsx`，从已有的 `useProfile` hook 读取用户真实头像和昵称，替换硬编码的"小美"和占位图片。

### 实施步骤

**1. 修改 `HomePage.tsx`**
- 引入 `useProfile` hook
- 头像：使用 `profile.avatar_url`，无头像时显示首字母 fallback
- 名字：使用 `profile.display_name`，无昵称时显示邮箱用户名
- 问候语根据当前时间动态显示（早上好/下午好/晚上好）

### 涉及文件
- `src/components/HomePage.tsx`（约 5-8 行改动）

