

## 个人中心页面真实化改造

### 当前问题
ProfilePage 里所有数据都是硬编码的假数据：
1. **用户信息**：头像、名字、地点、加入日期全是写死的"小美"
2. **统计数据**：总练习次数 142、活跃周数 24 等全是假数字
3. **热力图**：随机生成，不反映真实练习记录
4. **紧张缓解图表**：SVG 硬编码的假曲线
5. **Hero 卡片和列表**：硬编码的课程，点击无反应
6. **按钮**：Settings、ChevronRight、Play、Share 等点击都没有功能
7. **尊享会员按钮**：点击无反应

### 方案

#### 1. 创建 workout_logs 表（记录用户练习历史）
- 字段：id, user_id, course_id (FK courses), completed_at, duration_seconds
- RLS：用户只能读写自己的记录
- 这张表驱动统计数据和热力图

#### 2. 用户信息从 profiles 表读取
- 头像、昵称从 `profiles` 表读取（已有 display_name, avatar_url）
- 加入日期从 `profiles.created_at` 读取
- 删除地点（profiles 表没有该字段，暂不显示）

#### 3. 统计数据从 workout_logs 计算
- 总练习次数：`count(*)`
- 活跃周数：按周去重计数
- 连续打卡：计算连续天数
- 锻炼肌群（课程分类数）：关联 courses 表按 category 去重

#### 4. 热力图从 workout_logs 生成
- 查询最近 20 周的练习记录，按日期聚合
- 每天练习次数映射到 0-4 级别

#### 5. Hero 卡片和列表改为从数据库读取
- Hero 卡片：显示用户最近未完成或推荐的下一个课程，点击跳转 `/course/:id`
- 列表：显示用户最近练习过的课程，点击跳转 `/course/:id`

#### 6. 按钮功能实现
- **Settings 按钮**：打开设置面板（含退出登录）
- **Hero Play 按钮**：跳转到对应课程详情 `/course/:id`
- **列表项点击**：跳转到 `/course/:id`
- **尊享会员按钮**：跳转到 `/paywall`
- **移除无用的 ChevronRight 按钮**（右上角）

#### 7. 紧张缓解图表
- 暂时保留 SVG 样式，但标注为"数据不足"（新用户无数据时显示空状态）

### 技术细节
- 新建 `workout_logs` 表 + RLS
- 新建 `src/hooks/useWorkoutLogs.ts` 封装查询
- 重构 `ProfilePage.tsx`：从 AuthContext 获取用户信息，从 hooks 获取统计和课程数据
- 使用 `useNavigate` 为按钮添加跳转逻辑
- 新增简易设置抽屉组件（含退出登录功能）

### 涉及文件
- 新建数据库迁移（workout_logs 表）
- 新建 `src/hooks/useWorkoutLogs.ts`
- 重构 `src/components/ProfilePage.tsx`

