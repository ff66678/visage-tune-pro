

## Onboarding Paywall 与 Content Gate Paywall 分离

### 现状分析
- Onboarding 流程结束后展示 `Paywall` 组件，点击关闭/CTA 后标记 `onboarding_completed = true`，进入首页
- `profiles` 表有 `paywall_completed` 字段，但目前未被使用
- 课程详情页点击"开始训练"直接跳转，没有付费检查

### 方案

**两套独立逻辑：**

1. **Onboarding Paywall**（一次性）
   - 保持现有流程不变
   - 用户在 Paywall 上点击 CTA 或关闭时，同时设置 `onboarding_completed = true` 和 `paywall_completed = true`（如果用户真的付费了）
   - 如果用户只是关闭/跳过，仅设置 `onboarding_completed = true`，`paywall_completed` 保持 `false`
   - 需要给 Paywall 组件区分模式：`onboarding` vs `content-gate`

2. **Content Gate Paywall**（持续拦截）
   - 在 `CourseDetail.tsx` 点击"开始训练"时，检查 `paywall_completed`
   - 如果未付费，弹出 Content Gate Paywall（全屏覆盖），而非跳转
   - 付费完成后设置 `paywall_completed = true`，然后跳转到训练页

### 实施步骤

**1. 修改 `Paywall.tsx`**
- 新增 `mode` prop：`"onboarding" | "content-gate"`
- `onboarding` 模式：保留关闭按钮（X），关闭 = 跳过付费
- `content-gate` 模式：关闭按钮返回上一页，CTA 文案可调整

**2. 修改 `Onboarding.tsx`**
- Paywall `onClose` 回调中，仅标记 `onboarding_completed = true`（跳过付费）
- Paywall CTA 成功后，标记 `onboarding_completed = true` + `paywall_completed = true`

**3. 新增 `usePaywallStatus` hook**
- 从 `profiles` 读取 `paywall_completed` 字段
- 提供 `markPaid` 方法

**4. 修改 `CourseDetail.tsx`**
- "开始训练"按钮点击时检查 `paywall_completed`
- 未付费 → 展示 Content Gate Paywall（useState 控制显示）
- 已付费 → 正常跳转 `/workout/:id`

### 涉及文件
- `src/pages/Paywall.tsx`（新增 mode prop）
- `src/pages/Onboarding.tsx`（拆分关闭/付费逻辑）
- `src/hooks/useProfile.ts`（或新建 `usePaywallStatus.ts`）
- `src/pages/CourseDetail.tsx`（添加付费检查）

