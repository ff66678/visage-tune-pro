

## 全产品 Bug 和逻辑问题审查

经过全面代码审查，发现以下问题：

---

### Bug 1（严重）：WorkoutPlayer 不记录训练日志

**位置**：`src/pages/WorkoutPlayer.tsx`

训练计时器倒计时到 0 后，什么都没发生——没有调用 `workout_logs` 的 insert。用户完成训练后，首页的"每周进度"、"连续打卡"、热力图等数据全部不会更新。

**修复**：训练完成时（seconds === 0），调用 supabase 插入一条 workout_log 记录，并 invalidate 相关 query。

---

### Bug 2（严重）：WorkoutPlayer 收藏按钮是假的

**位置**：`src/pages/WorkoutPlayer.tsx` 第42行、第119行

收藏状态用 `useState(false)` 管理，仅是本地 UI 切换，没有读取也没有写入 `favorites` 表。退出页面就丢失。

**修复**：改用 `useFavoriteIds` 和 `useToggleFavorite` hooks（与 CourseDetail 一致）。

---

### Bug 3（中等）：WorkoutPlayer 内容硬编码

**位置**：`src/pages/WorkoutPlayer.tsx` 第133-134行

无论打开哪个课程，动作名称始终显示 "V字手势提升"，说明文字也是固定的。应该从课程数据动态读取。

**修复**：用 `course?.title` 和 `course?.description` 替代硬编码文本。

---

### Bug 4（中等）：Google OAuth 登录后 Onboarding 不会继续问卷

**位置**：`src/pages/Auth.tsx` 第53-54行

当 `onSuccess` 存在时（即从 Onboarding 调用），Google OAuth 的 `redirect_uri` 设为 `/onboarding`。OAuth 回调后浏览器加载 `/onboarding`，但这是一次全新的页面加载。组件会重新挂载，`loading` 先为 true，等 session 恢复后 `user` 有值，此时 `onboardingCompleted` 可能还是 null（正在查询中），导致短暂闪烁或直接跳过问卷进入首页。

实际上这不是致命 bug，因为 `onboardingCompleted === null` 时会显示 loading，而查询完成后若为 false 则正常进入问卷。但风险在于：如果 profile 还没创建（新用户首次 OAuth 登录），`fetchOnboardingStatus` 会返回 false，此时正确。所以这个**基本正常**，但需要确认新用户注册时 profile 是否自动创建。

---

### Bug 5（中等）：新用户注册后没有自动创建 profile

**位置**：`src/contexts/AuthContext.tsx`

`fetchOnboardingStatus` 查询 profile，但如果是新注册用户，profile 表可能没有记录。`maybeSingle` 之类的查询未使用，用的是 `.single()` —— 如果没有记录会报错。

**修复**：需要确认是否有数据库 trigger 自动创建 profile。如果没有，应该在 AuthContext 中当 profile 不存在时自动 insert 一条。

---

### Bug 6（轻微）：Paywall 月度订阅的续订日期硬编码

**位置**：`src/pages/Paywall.tsx` 第202行

`自动续订至 2025年5月4日` 是硬编码的过去日期。年度订阅也是硬编码 `2027年4月4日`。

**修复**：动态计算日期，月度 = 当前日期 + 1 个月，年度 = 当前日期 + 1 年。

---

### Bug 7（轻微）：Console 警告 — Function components cannot be given refs

**位置**：`src/components/HomePage.tsx` 和 `src/pages/Index.tsx`

`Skeleton` 和 `BottomTabBar` 组件被传入 ref 但未使用 `forwardRef`。不影响功能但会在控制台产生大量警告。

**修复**：Index.tsx 中 `scrollRef` 应绑定在容器 div 上（已绑定），问题可能来自其他地方给 Skeleton 传 ref。检查后发现 Index 的 `<ActivePage />` 渲染方式可能导致 ref 误传。

---

### Bug 8（轻微）：首页"今天还没有计划"点击跳转 `/library` 但该路由不存在

**位置**：`src/components/HomePage.tsx` 第191行

点击会跳到 `/library`，但 App.tsx 路由表中没有 `/library` 路由，会到 NotFound 页面。课程库在底部 tab 第二个（tab=1）。

**修复**：改为 `navigate("/?tab=1")`。

---

### 改动汇总

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | 添加训练完成时的日志写入；用真实 hooks 替换假收藏；动态显示课程内容 |
| `src/pages/Paywall.tsx` | 动态计算续订日期 |
| `src/components/HomePage.tsx` | 修复 `/library` 导航为 `/?tab=1` |
| `src/contexts/AuthContext.tsx` | 新用户 profile 不存在时自动创建 |

