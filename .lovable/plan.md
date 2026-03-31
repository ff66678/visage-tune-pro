

## Plan: 已付费用户点击"尊享会员"跳转会员页

### 改动文件
**`src/components/ProfileDetailContent.tsx`**

### 方案
在组件中引入 `usePaywallStatus`，根据 `isPaid` 状态决定跳转目标：
- 已付费 → `/membership`（会员管理页）
- 未付费 → `/paywall`（付费墙）

将第 173 行的 `onClick={() => navigate("/paywall")}` 改为 `onClick={() => navigate(isPaid ? "/membership" : "/paywall")}`。

