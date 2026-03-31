

## Plan: 未登录用户在付费墙点击订阅时跳转登录页

### 逻辑流程
未登录点击"开始训练" → 显示付费墙 → 点击订阅按钮 → 跳转登录页（带 returnTo）→ 登录后返回课程页

### 改动

**1. `src/pages/CourseDetail.tsx`**

`handleStartWorkout` 中移除登录检查，未付费用户统一显示付费墙（无论是否登录）：

```tsx
const handleStartWorkout = () => {
  if (isPaid) {
    navigate(`/workout/${course!.id}`);
  } else {
    setShowContentGate(true); // 不管登录与否都显示付费墙
  }
};
```

将 `user` 传给 Paywall 组件，让付费墙知道用户是否已登录。

**2. `src/pages/Paywall.tsx`**

- 接收新 prop `user`（或从 `useAuth` 获取）
- 在 `handleStartTrial` 中：未登录时 `navigate("/auth?returnTo=当前路径")`，已登录时走原有付费流程

**3. `src/pages/Auth.tsx`**

登录成功后读取 `returnTo` 参数并跳转回去（而非默认首页）。

### 不变的部分
- 付费墙 UI、定价卡片不变
- 已登录已付费用户流程不变

