

## 修复：WorkoutPlayer 关闭按钮返回到当前 tab 首页

### 问题

当前 `handleClose` 使用 `navigate(-1)`，这会返回到上一个历史记录（可能是 CourseDetail 而非 tab 首页）。用户期望点 X 直接回到当前导航栏的 tab。

### 方案

由于用户通常从课程库（tab=1）进入 WorkoutPlayer，关闭时应直接导航到 `/?tab=1`（或用户进入时所在的 tab）。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | `handleClose` 中将 `navigate(-1)` 改为 `navigate("/?tab=1", { replace: true })`，直接返回课程库 tab |

由于 WorkoutPlayer 只能从课程详情页进入，而课程详情页属于课程库 tab（tab=1），所以固定导航到 `/?tab=1` 即可。如果将来有其他入口，可以通过 URL 参数或 location state 传递来源 tab。

