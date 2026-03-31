

## Plan: 登录后自动重新显示付费墙

### 问题根因
游客点击"开始训练" → 显示付费墙 → 点击订阅 → 跳转 `/auth?returnTo=/course/xxx` → 登录后返回 `/course/xxx`，但 `showContentGate` 状态被重置为 `false`（组件重新挂载），所以用户看到的是课程详情页而不是付费墙，再次点击"开始训练"就能直接进入训练。

### 改动

**1. `src/pages/Paywall.tsx`**

`handleStartTrial` 中，`returnTo` 加上 `?showPaywall=true` 参数：

```tsx
navigate(`/auth?returnTo=${encodeURIComponent(currentPath + "?showPaywall=true")}`);
```

**2. `src/pages/CourseDetail.tsx`**

读取 URL 中的 `showPaywall` 参数，初始化 `showContentGate` 状态：

```tsx
const [searchParams] = useSearchParams();
const [showContentGate, setShowContentGate] = useState(
  searchParams.get("showPaywall") === "true"
);
```

这样登录后返回课程页时，付费墙会自动显示，用户必须完成付费才能访问内容。

### 不变的部分
- 付费流程、定价卡片不变
- 已付费用户体验不变

