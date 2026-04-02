

# 问题诊断报告（第二轮）

基于上一轮修复后的代码全面审查，以下是新发现的问题。

---

## 严重 (Critical)

### C1. AnalysisPage 推荐课程过滤使用硬编码中文匹配

- **类型**: 真正的 bug
- **复现**: 切换为英文/日文/韩文后，面部分析推荐课程逻辑在 `getRecommendedCourses()` 中用 `cat.includes("下颌")` / `cat.includes("法令")` / `cat.includes("眼")` 做中文字符串匹配。而 `useCourses` 在非中文语言下会返回翻译后的 category（或原始中文 category 取决于翻译逻辑）
- **影响**: 非中文环境下推荐逻辑永远匹配不到，退回到 fallback（前3条课程），推荐完全失效
- **涉及文件**: `src/components/AnalysisPage.tsx` L86-101
- **修复建议**: 用数据库原始 category 值（中文）做匹配，而不是翻译后的值。或改为用 category key 常量做匹配
- **是否立即修复**: 是

### C2. LibraryPage 过滤器使用硬编码中文 `dbValue` 做匹配

- **类型**: 逻辑风险
- **复现**: LibraryPage L25-34 的 `filterKeys` 中 `dbValue` 是中文（"眼部"、"下颌" 等），直接与 `course.category` 做 `===` 比较。如果 `useCourses` 返回的是翻译后的 category，过滤将完全失效
- **影响**: 取决于 `useCourses` 是否翻译 category 字段。如果翻译了，非中文用户无法按分类筛选
- **涉及文件**: `src/components/LibraryPage.tsx` L25-34, L106-107
- **修复建议**: 确保 category 过滤始终用数据库原始值，UI 展示时才翻译
- **是否立即修复**: 是 — 需确认 `useCourses` 的翻译逻辑

---

## 中等 (Medium)

### M1. WorkoutPlayer 计时器初始值闪烁

- **类型**: UX 问题
- **复现**: 打开 WorkoutPlayer 时，`seconds` 初始为 45（L50），然后 useEffect 在 course 加载后重设为 `parseDuration(course.duration)`。用户会短暂看到 `00:45` 然后跳变
- **影响**: 视觉闪烁
- **涉及文件**: `src/pages/WorkoutPlayer.tsx` L50, L84-89
- **修复建议**: 初始值设为 0 或 null，在 course 未加载时显示 loading 状态
- **是否立即修复**: 建议修

### M2. WorkoutPlayer 自动播放 — 用户还没看清就开始倒计时

- **类型**: UX 问题
- **复现**: 进入 WorkoutPlayer 时 `isPlaying` 默认 `true`（L49），倒计时立即开始。用户可能还没准备好
- **影响**: 训练体验不佳
- **涉及文件**: `src/pages/WorkoutPlayer.tsx` L49
- **修复建议**: 默认 `isPlaying=false`，或加一个 3 秒倒计时准备阶段
- **是否立即修复**: 建议修（UX 优化）

### M3. 产品价格显示硬编码 `¥` 符号

- **类型**: 国际化缺失
- **复现**: `AnalysisPage.tsx` L227 `¥{Number(product.price).toFixed(0)}`，对非中国用户显示人民币符号
- **影响**: 多币种用户体验不一致
- **涉及文件**: `src/components/AnalysisPage.tsx` L227
- **修复建议**: 产品表增加 `currency` 字段，或根据 locale 格式化
- **是否立即修复**: 中 — 如只面向中国市场可延后

### M4. ProfilePage 使用 `ProfilePage` 组件但 `/profile` 路由指向 `ProfileDetail`

- **类型**: 结构混淆
- **复现**: 有 `ProfilePage.tsx` 和 `ProfileDetail.tsx` + `ProfileDetailContent.tsx`。`/profile` 路由实际加载 `ProfileDetail`。`ProfilePage` 被 Index.tsx 通过 tab 展示但没有对应路由
- **影响**: 不是 bug，但命名容易混淆。ProfilePage 是"我的"tab 页面，ProfileDetail 是独立路由页面
- **涉及文件**: `src/components/ProfilePage.tsx`, `src/pages/ProfileDetail.tsx`
- **修复建议**: 重命名 `ProfilePage` 为 `MyPage` 或 `AccountTab`，让命名更清晰
- **是否立即修复**: 否 — 结构优化

### M5. Membership 页面对已付费用户始终显示"年度会员"

- **类型**: 逻辑不完整
- **复现**: `Membership.tsx` L54 固定显示 `t("membership.annualMember")`，不区分用户实际订阅的是月度还是年度
- **影响**: 月度订阅用户看到的也是"年度会员"
- **涉及文件**: `src/pages/Membership.tsx` L54
- **修复建议**: 从 RevenueCat 或数据库获取实际订阅类型并展示
- **是否立即修复**: 中 — 上线前应修

### M6. Paywall 底部 CTA 按钮在宽屏上横跨全屏

- **类型**: UI 问题
- **复现**: Paywall.tsx L222 `fixed bottom-0 left-0 right-0`，没有 `max-w-[480px]`
- **影响**: 宽屏上 CTA 按钮拉满，视觉不一致
- **涉及文件**: `src/pages/Paywall.tsx` L222
- **修复建议**: 添加 `max-w-[480px] mx-auto left-1/2 -translate-x-1/2`
- **是否立即修复**: 建议修

### M7. AnalysisPage 推荐课程点击需要登录，但分析页本身不需要登录

- **类型**: UX 矛盾
- **复现**: 未登录用户可以在分析页看到推荐课程列表，但点击任何一个都会跳转登录页。课程本身是公开数据。
- **影响**: 体验割裂 — 看到了但不让点
- **涉及文件**: `src/components/AnalysisPage.tsx` L198
- **修复建议**: 推荐课程不需要登录即可查看详情（`CourseDetail` 已是公开路由）。移除 `requireAuth()` 检查
- **是否立即修复**: 建议修

### M8. AuthContext `fetchOnboardingStatus` 可能导致竞态

- **类型**: 逻辑风险
- **复现**: `onAuthStateChange` 中用 `setTimeout(() => fetchOnboardingStatus(...), 0)` 延迟执行，同时 `getSession` 也调用 `fetchOnboardingStatus`。如果两个几乎同时触发，可能导致两次 profile insert 尝试
- **影响**: insert 有 unique constraint（user_id），第二次会失败但被 silently ignored（因为用的是 `maybeSingle`）。实际影响小但代码不够健壮
- **涉及文件**: `src/contexts/AuthContext.tsx` L49-62
- **修复建议**: 在 `onAuthStateChange` 中不调用 `fetchOnboardingStatus`，只依赖 `getSession` 的结果；或用 flag 防止重复调用
- **是否立即修复**: 低优先级

---

## 轻微 (Minor)

### L1. Onboarding 答案存储的是翻译后的文本而非 key

- **类型**: 数据质量
- **复现**: 用户选择"紧致提升"时，`goal` 存储的是 `t("onboarding.goalLift")` 的翻译值（如中文"紧致提升"、英文"Lift & Firm"）。不同语言的用户存储不同的文本
- **影响**: 后端无法统一分析用户偏好，无法根据 goal 做推荐
- **涉及文件**: `src/pages/Onboarding.tsx` L31, L42-44
- **修复建议**: 存储 key（如 `"lift"`、`"glow"`）而非翻译后文本
- **是否立即修复**: 是 — 数据质量问题，越早修越好

### L2. WeeklyProgress fallback 标签仍有硬编码中文

- **类型**: 国际化缺失
- **复现**: `useWeeklyProgress` L111 fallback labels `["一", "二", "三", "四", "五", "六", "日"]`
- **影响**: 如果调用方忘记传 labels 参数，会显示中文
- **涉及文件**: `src/hooks/useWorkoutLogs.ts` L111
- **修复建议**: 移除 fallback 或改为语言无关的简写
- **是否立即修复**: 轻微

### L3. ProfilePage 头像硬编码 fallback URL

- **类型**: 硬编码
- **复现**: ProfilePage L61, ProgressPage L84 都用 pexels.com 的固定图片作为默认头像
- **影响**: 如果 pexels CDN 不可用，头像区域可能显示裂图
- **涉及文件**: `src/components/ProfilePage.tsx` L61, `src/components/ProgressPage.tsx` L84
- **修复建议**: 用本地 SVG 占位图
- **是否立即修复**: 低

---

## 修复优先级

| 优先级 | 问题 | 类型 |
|--------|------|------|
| 1 | C1 - 分析页推荐匹配硬编码中文 | Bug |
| 2 | C2 - 课程库过滤器硬编码中文 | Bug |
| 3 | L1 - Onboarding 答案存翻译文本 | 数据质量 |
| 4 | M7 - 推荐课程不需要强制登录 | UX |
| 5 | M1 - 计时器初始值闪烁 | UX |
| 6 | M2 - 自动播放无准备时间 | UX |
| 7 | M6 - Paywall CTA 宽屏问题 | UI |
| 8 | M3 - 价格硬编码¥ | 国际化 |
| 9 | M5 - 会员页固定显示年度 | 逻辑 |
| 10 | M8 - AuthContext 竞态 | 健壮性 |

