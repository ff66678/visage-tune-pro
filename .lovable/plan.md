

## 课程数据统一方案

### 问题
目前首页、课程库、课程详情页的数据各自硬编码，点击任何课程都显示同一个详情内容（"紧致提升大师课"），标题、图片、描述与列表页不一致。

### 方案
创建数据库 `courses` 表存储所有课程数据，各页面从数据库读取，保证里外一致。

### 实施步骤

**1. 创建 courses 数据表并插入种子数据**

建表字段：id, title, subtitle, image_url, tag, category, duration, difficulty, intensity, description, target_audience, expected_effect, rating, review_count, created_at

插入当前硬编码的所有课程（首页推荐 2 个 + 课程库 6 个 + 今日计划 1 个），共约 7-9 条数据。RLS 设置为所有已认证用户可读。

**2. 创建共享数据 Hook**

新建 `src/hooks/useCourses.ts`，使用 react-query + supabase 查询课程列表和单个课程详情。

**3. 改造 HomePage**

- "今日计划"和"为你推荐"部分从数据库读取
- 点击时传递正确的课程 ID 到 `/course/:id`

**4. 改造 LibraryPage**

- 课程列表从数据库读取，替换硬编码数组
- 点击课程卡片导航到 `/course/:id`

**5. 改造 CourseDetail**

- 用 `useParams` 获取 ID，从数据库查询对应课程
- 动态渲染标题、图片、时长、难度等字段
- 添加加载状态

**6. 改造 WorkoutPlayer**

- 接收课程 ID（通过 URL 参数或 state），显示对应课程标题

### 技术细节
- 使用 `@tanstack/react-query` 缓存课程数据
- 路由保持 `/course/:id`，WorkoutPlayer 改为 `/workout/:id`
- 课程图片继续使用外部 URL（存在数据库中）

