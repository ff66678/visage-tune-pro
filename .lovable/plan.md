

## 修复当前 Bug

根据之前的审查和 console 日志，以下是需要修复的 Bug（已排除 Capacitor/RevenueCat 相关项）：

### 要修复的问题

| # | Bug | 文件 |
|---|---|---|
| 1 | **SwipeBack ref 警告**：`SwipeBack` 是函数组件但被当作需要 ref 的组件使用，console 报 "Function components cannot be given refs"。实际是 React 对函数组件渲染时的校验警告 | `src/components/SwipeBack.tsx` |
| 2 | **ProtectedRoute ref 警告**：同理，`ProtectedRoute` 函数组件也触发此警告 | `src/App.tsx` |
| 3 | **ProfilePage → WorkoutPlayer 关闭后导航错误**：ProfilePage 传 `fromCourse: "/profile"`，但 WorkoutPlayer 只读 `fromTab`，关闭后回到 `/?tab=0` 而非 `/profile` | `src/pages/WorkoutPlayer.tsx` |
| 4 | **LibraryPage 硬编码中文难度匹配**：`difficultyColor` 用中文字符串 "入门"/"中级"/"进阶" 匹配，如果数据库 difficulty 字段用英文则全部 fallback | `src/components/LibraryPage.tsx` |
| 5 | **Gift 红点永远显示**：硬编码 `<span>` 无条件渲染 | `src/components/HomePage.tsx` |

### 改动方案

**1. SwipeBack — 使用 `forwardRef`**
用 `React.forwardRef` 包装 `SwipeBack`，消除 ref 警告。

**2. ProtectedRoute — 使用 `forwardRef`**
同理包装 `ProtectedRoute`。

**3. WorkoutPlayer 支持 `fromCourse` 导航回源页面**
- 从 `location.state` 读取 `fromCourse`（如 `"/profile"`）
- `handleClose` 中：如果有 `fromCourse`，导航到 `fromCourse`；否则导航到 `/?tab=${fromTab}`

**4. LibraryPage `difficultyColor` 兼容英文**
在匹配中同时支持中文和英文：`"入门" | "beginner"` → 绿色，`"中级" | "intermediate"` → 琥珀色，`"进阶" | "advanced"` → 红色。

**5. 移除 Gift 硬编码红点**
删除 HomePage 中 Gift 按钮上的 `<span>` 红点元素。

### 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/SwipeBack.tsx` | 添加 `forwardRef` |
| `src/App.tsx` | `ProtectedRoute` 添加 `forwardRef` |
| `src/pages/WorkoutPlayer.tsx` | 读取 `fromCourse` state，关闭时优先导航回源页面 |
| `src/components/LibraryPage.tsx` | `difficultyColor` 兼容英文 |
| `src/components/HomePage.tsx` | 移除 Gift 红点 |

