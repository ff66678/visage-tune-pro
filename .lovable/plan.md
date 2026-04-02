

# 全面问题审计报告

---

## 严重 (Critical) — 影响上线

### S1. 首页路由 `/` 未受 ProtectedRoute 保护，但依赖已登录数据

- **类型**: 逻辑风险
- **复现**: 未登录用户直接访问 `/`，首页正常显示（设计如此），但 `useWeeklyProgress`、`useFavorites`、`usePaywallStatus` 等 hook 在 `user=null` 时仍被调用
- **影响**: 目前 hook 内部有 `enabled: !!user` 守护，不会崩溃。但 `usePaywallStatus` 在 web 端当 `!user` 时 query 被跳过，`isPaid` 默认 `false`，PRO 按钮会始终显示 — 这是正确行为
- **根因**: `/` 路由有意设计为公开。此项不是 bug，确认无问题
- **是否修复**: 否，行为正确

### S2. Onboarding 答案数据未持久化

- **类型**: 真正的 bug
- **复现**: 完成 onboarding 6 步问卷，选择的 goal、skinType、concerns、time 数据仅存在于组件 state 中，`completeOnboarding` 函数只更新 `onboarding_completed=true`，从未将用户选择写入数据库
- **影响**: 用户辛苦回答的个性化数据全部丢失，无法用于推荐、个性化等后续功能
- **涉及文件**: `src/pages/Onboarding.tsx` (L348-354)
- **修复建议**: 在 profiles 表增加 `onboarding_goal`、`skin_type`、`concerns`、`preferred_time` 字段，onboarding 完成时一并写入
- **是否立即修复**: 是 — 核心产品数据丢失

### S3. `useFaceAnalysis` 成功/失败 toast 使用硬编码中文

- **类型**: 真正的 bug
- **复现**: 切换为英文/韩文/日文后，面部分析成功显示 "分析完成 ✨"，失败显示 "分析失败：..."
- **影响**: 多语言用户体验断裂
- **涉及文件**: `src/hooks/useFaceAnalysis.ts` (L73-77)
- **修复建议**: 使用 i18n key 替换硬编码
- **是否立即修复**: 是

### S4. `handle_new_user` 触发器未挂载

- **类型**: 真正的 bug
- **复现**: 数据库有 `handle_new_user()` 函数但 triggers 列表为空 — 说明新用户注册时不会自动创建 profile
- **影响**: AuthContext 的 fallback 逻辑（L39-43）会手动 insert，但没有设置 `display_name` 和 `avatar_url`，这些只有 trigger 才会从 `raw_user_meta_data` 提取。Google OAuth 注册的用户头像和显示名会丢失
- **涉及文件**: 数据库 trigger 配置, `src/contexts/AuthContext.tsx`
- **修复建议**: 创建 migration 挂载 trigger: `CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
- **是否立即修复**: 是

---

## 中等 (Medium)

### M1. Paywall web 端跳过付费过于轻松

- **类型**: 需要产品决策
- **复现**: web 端点击"开始试用"直接 `markPaid()` 写入 `paywall_completed=true`，无需任何支付
- **影响**: 开发/测试方便，但如果 web 版对外发布，任何用户都能免费解锁全部内容
- **涉及文件**: `src/pages/Paywall.tsx` (L68-73), `src/hooks/usePaywallStatus.ts`
- **修复建议**: 需要你决定 web 端是否需要真实支付（如 Stripe），还是仅限 native 端收费
- **是否立即修复**: 产品决策点

### M2. CourseDetail 顶部栏和底部栏使用 `createPortal(document.body)`

- **类型**: 逻辑风险
- **复现**: 顶部/底部按钮 portal 到 body，不受 `max-w-[480px]` 容器约束
- **影响**: 在宽屏设备上，顶栏和底栏会横跨全屏而非限制在 480px 内。移动端正常
- **涉及文件**: `src/pages/CourseDetail.tsx` (L110, L202)
- **修复建议**: 改为 portal 到 `SwipeBack` 容器内，或添加 `max-w-[480px] mx-auto` 到 portal 元素
- **是否立即修复**: 中 — 移动端优先的话可延后

### M3. Onboarding 流程中 paywall 的 `onClose` 直接完成 onboarding

- **类型**: 逻辑风险
- **复现**: 用户在 onboarding paywall 点 X 关闭 → 调用 `completeOnboarding()` → `onboarding_completed=true` → 跳转首页。用户可跳过付费
- **影响**: 这是设计意图（onboarding 模式 paywall 允许跳过），但如果未来希望强制付费，这里需要改
- **涉及文件**: `src/pages/Onboarding.tsx` (L386)
- **修复建议**: 确认这是产品意图
- **是否立即修复**: 产品决策点

### M4. 未付费用户可自由访问所有课程内容（除了开始训练）

- **类型**: 需要产品决策
- **复现**: 未付费用户可以浏览所有课程详情页，查看描述、评分等。只有点"开始训练"时才拦截
- **影响**: 这可能是有意的（preview before buy），也可能需要更早拦截
- **涉及文件**: `src/pages/CourseDetail.tsx` (L54-61)
- **修复建议**: 确认这是产品意图
- **是否立即修复**: 产品决策点

### M5. `profiles` 表的 RLS insert 策略允许 `public` 角色

- **类型**: 安全风险
- **复现**: profiles 表的 INSERT 和 UPDATE 策略使用 `public` 角色而非 `authenticated`
- **影响**: 理论上匿名用户也可以尝试 insert/update profile（但 `auth.uid()` check 会让实际影响有限）。但最佳实践是限制为 `authenticated`
- **涉及文件**: 数据库 RLS policies
- **修复建议**: 将 profiles 表 INSERT/UPDATE/SELECT 策略角色改为 `authenticated`
- **是否立即修复**: 建议修

### M6. Leaked Password Protection 未开启

- **类型**: 安全风险
- **复现**: Supabase linter 报告密码泄露检测已关闭
- **影响**: 用户可使用已知泄露的弱密码注册
- **涉及文件**: Auth 配置
- **修复建议**: 在 Lovable Cloud Auth Settings 中启用 Password HIBP Check
- **是否立即修复**: 建议修

### M7. Google OAuth 回调 URL 在 onboarding 模式下可能不正确

- **类型**: 逻辑风险
- **复现**: `Auth.tsx` L61-63，当 `onSuccess` 回调存在时 redirect_uri 固定为 `/onboarding`；但 OAuth 返回后浏览器会加载该 URL，此时 `AuthRoute` 检测到 user 已登录会 redirect 到 returnTo（默认 `/`）
- **影响**: 新用户通过 Google 登录 → 可能跳过 onboarding
- **根因**: OAuth 的 redirect flow 和 SPA 路由守卫之间存在竞态。Google 登录后到达 `/auth?returnTo=/onboarding`，但 `AuthRoute` 检测到已登录后会 redirect 到 returnTo
- **涉及文件**: `src/pages/Auth.tsx` (L60-65)
- **修复建议**: Google OAuth redirect_uri 应该直接指向 `/`，由 `ProtectedRoute` 检测 onboardingCompleted 来决定跳转
- **是否立即修复**: 是 — 影响新用户 Google 登录流程

### M8. 面部分析页和进度记录页职责略有重叠

- **类型**: 结构优化建议
- **复现**: 分析页（tab 3）有拍照上传功能，进度页（tab 4）也有拍照上传功能。分析页上传的照片同时出现在进度页的照片列表中
- **影响**: 用户可能困惑"应该在哪个页面拍照"
- **涉及文件**: `src/components/AnalysisPage.tsx`, `src/components/ProgressPage.tsx`
- **修复建议**: 明确区分：分析页=AI 面部分析（用于打分），进度页=每日打卡记录照片。建议分析页的照片单独存储或在 UI 上做更清晰的区分
- **是否立即修复**: 否 — 后期产品优化

---

## 轻微 (Minor)

### L1. GiftPage 无实际礼物逻辑

- **类型**: 功能缺失
- **复现**: `/gift` 页面只有一个分享按钮，无 gift entitlement、无礼物码生成/兑换逻辑
- **影响**: 仅作为裂变分享页面，不是真正的"赠送会员"功能
- **涉及文件**: `src/pages/GiftPage.tsx`
- **修复建议**: 如需真实礼物功能，需设计 gift code 系统。当前作为 MVP 分享页可接受
- **是否立即修复**: 产品决策点

### L2. `usePaywallStatus` 使用 `as any` 绕过类型检查

- **类型**: 工程质量
- **复现**: `paywall_completed` 字段通过 `as any` 强制类型
- **影响**: 字段已在 profiles 表中存在，类型文件可能未同步
- **涉及文件**: `src/hooks/usePaywallStatus.ts` (L33), `src/pages/Onboarding.tsx` (L350, L379)
- **修复建议**: 等类型自动同步后移除 `as any`
- **是否立即修复**: 否

### L3. WorkoutPlayer 计时器为纯前端倒计时

- **类型**: 结构优化建议
- **复现**: 训练页面只有倒计时，没有动作指导、步骤切换
- **影响**: 用户体验偏简，后续需要丰富
- **涉及文件**: `src/pages/WorkoutPlayer.tsx`
- **修复建议**: 后续迭代添加分步动作、视频指导
- **是否立即修复**: 否

### L4. 课程详情页评论为硬编码假数据

- **类型**: 硬编码
- **复现**: `CourseDetail.tsx` L188 使用固定 unsplash 头像和翻译 key 里的固定评论
- **影响**: 所有课程显示相同的评论
- **涉及文件**: `src/pages/CourseDetail.tsx` (L186-197)
- **修复建议**: 后期建立评论系统或至少用数据库中的评论数据
- **是否立即修复**: 否

### L5. LanguageProvider 包裹了两层

- **类型**: 工程质量
- **复现**: `main.tsx` 包裹了 `<LanguageProvider>`，`App.tsx` 内又包裹了一层 `<LanguageProvider>`
- **影响**: 不会报错（内层覆盖外层），但造成不必要的 context 重复
- **涉及文件**: `src/main.tsx` (L6), `src/App.tsx` (L67)
- **修复建议**: 移除 `main.tsx` 中的 `LanguageProvider`
- **是否立即修复**: 轻微，顺手修

### L6. 产品推荐链接对未登录用户完全隐藏购买 URL

- **类型**: 设计考量
- **复现**: `AnalysisPage.tsx` L217，未登录时 `href="#"`，点击跳转登录
- **影响**: 可能希望游客也能查看商品（但不能购买），当前行为合理
- **是否立即修复**: 否

---

## 修复优先级列表

| 优先级 | 问题 | 类型 | 建议 |
|--------|------|------|------|
| 1 | S4 - handle_new_user 触发器未挂载 | Bug | 立即修复 |
| 2 | S2 - Onboarding 答案未持久化 | Bug | 立即修复 |
| 3 | M7 - Google OAuth 回调 URL 竞态 | 逻辑风险 | 立即修复 |
| 4 | S3 - 面部分析 toast 硬编码中文 | Bug | 立即修复 |
| 5 | M6 - 密码泄露检测未开启 | 安全 | 尽快修复 |
| 6 | M5 - profiles RLS 使用 public 角色 | 安全 | 尽快修复 |
| 7 | L5 - LanguageProvider 重复包裹 | 工程质量 | 顺手修 |
| 8 | M2 - CourseDetail portal 宽屏问题 | UI | 可延后 |
| 9 | M1 - Web 端免费解锁 | 产品决策 | 需要你定 |
| 10 | M3 - Onboarding paywall 可跳过 | 产品决策 | 需要你定 |
| 11 | M4 - 课程详情页内容无付费墙 | 产品决策 | 需要你定 |
| 12 | L1 - Gift 页无实际逻辑 | 功能缺失 | 需要你定 |

---

## 不确定项

- **profiles 表 `paywall_completed` 和 RevenueCat 状态同步问题**: 如果用户在 iOS 端取消订阅，RevenueCat 会更新 entitlement 状态，但 `paywall_completed` 在数据库中仍为 `true`。Web 端会误判为仍是付费用户。不确定当前是否有 webhook 处理这种情况（未看到相关 edge function），但这在未来上线 native 端时是一个必须解决的问题。

- **email 确认是否已开启**: 代码中注册后只显示 toast "请查看邮箱确认"，但未看到 auth 配置中 auto-confirm 的设置状态。如果 auto-confirm 被开启，用户无需验证邮箱即可登录。不确定当前配置状态。

