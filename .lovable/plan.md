

## 修复付费墙持久化：独立路由也写入数据库

### 问题
当前 `/paywall` 路由渲染的 `Paywall.tsx` 点击"开始免费试用"时只调用 `onClose`（即 `window.history.back()`），没有写入 `paywall_completed = true` 到数据库。所以每次重新打开都会再次显示付费墙。

### 修复方案

**修改 `Paywall.tsx`**
- 引入 `useAuth` 和 `supabase`
- `handleStartTrial` 中先写入 `paywall_completed = true` 到 profiles 表，再调用 `onClose`
- X 关闭按钮同样标记为已完成（因为用户已看过付费墙）

**修改 `App.tsx`**
- `PaywallRoute` 的 `onClose` 改为导航到 `/`（而非 `history.back()`），因为完成后应进入首页

### 涉及文件
- `src/pages/Paywall.tsx` — 添加数据库写入逻辑
- `src/App.tsx` — 调整 `onClose` 导航目标

