

## 产品全面审查：Bug、逻辑问题与设计不合理之处

### 一、Bug 类

| # | 问题 | 位置 | 严重度 |
|---|---|---|---|
| 1 | **Console 报错：Function components cannot be given refs** | `LibraryPage` 给 `Skeleton` 传 ref、`Index` 给 `BottomTabBar` 传 ref | 中 |
| 2 | **Paywall 没有真实支付集成** | `Paywall.tsx` 的 `handleStartTrial` 只是 `setTimeout` 1.5s 后调用 `onPaid`，无任何支付验证，任何人点击即可获得"已付费"状态 | 高 |
| 3 | **SwipeBack 的 `navigate(-1)` 不受控** | `SwipeBack.tsx:55` 左滑返回时用 `navigate(-1)`，与 WorkoutPlayer 已修复的逻辑不一致。从 CourseDetail 左滑返回可能回到错误页面（如外部链接跳入时历史栈为空） | 中 |
| 4 | **Onboarding 数据未持久化** | 用户选择的 goal、skinType、concerns、time 全在本地 state，完成 onboarding 后这些偏好数据丢失，无法用于个性化推荐 | 中 |
| 5 | **Heatmap 网格方向错误** | `ProfilePage` 的 heatmap 用 `grid-cols-[repeat(20,1fr)] grid-rows-[repeat(7,1fr)]`，但数据是按天顺序 push 的（共 140 个），CSS Grid 默认按行填充，导致数据排列为"一行 20 天"而非"一列 7 天（一周）"。应使用 `grid-flow-col` | 中 |
| 6 | **`startClicked` 状态不会重置** | `HomePage.tsx:23` 点击"开始"按钮后 `startClicked` 设为 true，但从课程页返回时组件不一定重新 mount（React 缓存），按钮永远显示"启动中" | 低 |

### 二、逻辑问题

| # | 问题 | 位置 |
|---|---|---|
| 7 | **未登录用户可看到所有 tab 内容但操作会被拦截** | `BottomTabBar` 所有 tab 的 `requiresAuth` 都是 false，用户可以自由浏览 Analysis/Progress 页面，但点击拍照等操作才弹登录。体验不一致——应该要么统一允许浏览，要么统一拦截 |
| 8 | **收藏按钮对未登录用户行为不一致** | `CourseDetail.tsx:83` 未登录时直接调用 `toggleFavorite.mutate` 会触发 mutation 报错（"Not authenticated"）。而 `WorkoutPlayer` 和 `LibraryPage` 各自有不同的未登录处理（toast / toast.error）|
| 9 | **ProfilePage 从 tab=3（Progress）进入课程时传 `fromTab: 3`** | `ProfilePage.tsx:102,111` 传 `fromTab: 3`，但 ProfilePage 本身不是通过 Index 的 tab 系统渲染的，它是 `/profile` 路由。从 Profile 进入课程再关闭 WorkoutPlayer 会回到 `/?tab=3`（Progress 页）而不是 Profile 页 |
| 10 | **Paywall "恢复购买"按钮无功能** | `Paywall.tsx:153` 恢复购买按钮没有 `onClick` 处理 |
| 11 | **`usePaywallStatus` 对未登录用户返回 false** | 未登录用户 `isPaid` 为 false，但 CourseDetail 的"开始训练"按钮会弹 paywall 而非登录页。应先检查登录状态 |
| 12 | **Weekly progress 的周计算可能在时区边界出错** | `useWorkoutLogs.ts` 的 `completed_at` 是 UTC 时间，但 `today.setHours(0,0,0,0)` 使用本地时间，可能导致跨时区用户的打卡记录归属到错误的日期 |

### 三、设计不合理之处

| # | 问题 | 建议 |
|---|---|---|
| 13 | **没有忘记密码功能** | Auth 页面只有登录/注册，缺少"忘记密码"入口 |
| 14 | **Profile 页面对已付费用户仍显示升级 Premium 按钮** | `ProfilePage.tsx:138` 无条件显示升级按钮，应根据 `isPaid` 隐藏 |
| 15 | **课程详情页的评论是硬编码假数据** | `CourseDetail.tsx:150-158` 评论者头像、名字、内容全是写死的，所有课程显示同一条评论 |
| 16 | **礼物页面通知红点永远显示** | `HomePage.tsx:113` Gift 按钮上的红点是写死的 `<span>` 元素，没有任何条件判断 |
| 17 | **课程分类名是中文硬编码** | `LibraryPage` 的 `filterKeys` 和 `difficultyColor` 使用中文字符串匹配（"入门"、"中级"、"进阶"），切换语言后分类筛选可能失效（如果数据库中存储的是中文但UI显示翻译后的文本） |
| 18 | **分析推荐课程的匹配逻辑太简单** | `AnalysisPage.tsx:68-84` 用 `category.toLowerCase().includes()` 匹配中文字符串，且只检查 3 个维度，大部分情况会 fallback 到 `courses.slice(0, 3)` |

### 四、建议修复优先级

**P0（应尽快修复）：**
- #2 Paywall 无真实支付验证（安全漏洞）
- #8 收藏按钮未登录时直接报错
- #11 未登录用户应先引导登录再弹 paywall

**P1（体验问题）：**
- #1 Console ref 警告
- #5 Heatmap 网格方向
- #9 ProfilePage fromTab 逻辑错误
- #13 缺少忘记密码
- #14 已付费用户仍显示升级按钮

**P2（优化项）：**
- #4 Onboarding 数据持久化
- #6 startClicked 重置
- #16 礼物红点逻辑
- #17 分类硬编码中文

