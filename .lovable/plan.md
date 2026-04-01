

## 修复课程详情页顶部栏滚动交互 + 底部按钮栏背景色统一

### 问题 1：顶部栏滚动交互不生效

**根因分析**：`SwipeBack` 容器使用了 `min-h-screen`，这不是一个确定的高度值。内部 `flex-1 overflow-y-auto` 的子元素需要父容器有确定高度才能形成滚动区域。由于父容器只有最小高度限制，子元素会撑开到内容实际高度，导致 `scrollTop` 始终为 0，`scrolled` 状态永远不会变为 `true`。

**修复**：将 `min-h-screen` 改为 `h-screen`，给 flex 容器一个确定高度，使内部 `contentRef` 形成真正的可滚动区域。

### 问题 2：底部按钮栏背景色

当前底部"开始训练"按钮容器使用 `bg-card/85`，需改为 `bg-background/85` 以统一为米色。

### 技术细节

| 文件 | 行号 | 改动 |
|---|---|---|
| `src/pages/CourseDetail.tsx` | 102 | `min-h-screen` → `h-screen` |
| `src/pages/CourseDetail.tsx` | 197 | `bg-card/85` → `bg-background/85` |

**改动后效果**：
- 进入课程详情页时，顶部栏无背景（透明），三个按钮有圆形背景悬浮在封面图上
- 向下滚动超过 20px 后，顶部栏渐显米色半透明背景，同时 padding 收缩
- 底部按钮栏背景与页面整体米色统一

