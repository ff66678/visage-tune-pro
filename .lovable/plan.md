

## 修复：WorkoutPlayer 关闭按钮动态返回来源 tab

### 问题

当前 `handleClose` 硬编码 `navigate("/?tab=1")`，但用户可能从首页（tab=0）、课程库（tab=1）、个人页等多个入口进入 CourseDetail → WorkoutPlayer。关闭时应返回用户实际所在的 tab。

### 方案

通过 URL 的 `searchParams` 从 Index 传递当前 tab 到 CourseDetail，再传递到 WorkoutPlayer。关闭时读取该参数返回对应 tab。

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/WorkoutPlayer.tsx` | 读取 `location.state.fromTab`（默认 0），`handleClose` 导航到 `/?tab=${fromTab}` |
| `src/pages/CourseDetail.tsx` | 接收 `location.state.fromTab` 并在导航到 WorkoutPlayer 时透传 |
| `src/components/HomePage.tsx` | 导航到 `/course/:id` 时传 `state: { fromTab: 0 }` |
| `src/components/LibraryPage.tsx` | 导航到 `/course/:id` 时传 `state: { fromTab: 1 }` |
| `src/components/AnalysisPage.tsx` | 如有课程导航，传 `state: { fromTab: 2 }` |
| `src/components/ProfilePage.tsx` | 导航到 `/course/:id` 时传 `state: { fromTab: 3 }` |
| `src/components/ProfileDetailContent.tsx` | 同上，传 `state: { fromTab: 3 }` |
| `src/pages/Favorites.tsx` | 传 `state: { fromTab: 1 }` |
| `src/pages/RecentlyPlayed.tsx` | 传 `state: { fromTab: 1 }` |

### 实现细节

**传递方式**：使用 `navigate` 的 `state` 参数：
```tsx
// HomePage 示例
navigate(`/course/${id}`, { state: { fromTab: 0 } })

// CourseDetail 透传到 WorkoutPlayer
const location = useLocation();
const fromTab = (location.state as any)?.fromTab ?? 0;
navigate(`/workout/${course!.id}`, { state: { fromTab } })

// WorkoutPlayer 读取并返回
const fromTab = (location.state as any)?.fromTab ?? 0;
setTimeout(() => navigate(`/?tab=${fromTab}`, { replace: true }), 320);
```

