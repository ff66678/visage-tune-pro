

## Plan: 切换账号为已付费模式

将当前用户的 `paywall_completed` 设为 `true`，同时确保 `onboarding_completed` 也为 `true`。

### 改动

**数据库迁移**

```sql
UPDATE profiles 
SET paywall_completed = true, onboarding_completed = true 
WHERE user_id = '3f415210-ed85-4829-a7c4-04f61a467fa5';
```

刷新页面后即可以已付费用户身份使用所有功能。

