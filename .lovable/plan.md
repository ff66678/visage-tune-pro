

## Plan: 未登录状态下也能看到内容

### 问题
`courses` 表的 RLS 策略设置为 `TO authenticated`，未登录用户无法读取课程数据，导致首页和课程库为空。

### 改动

**1. 数据库迁移 — 添加匿名读取策略**

给 `courses` 表添加一条新的 RLS 策略，允许匿名用户也能读取：

```sql
CREATE POLICY "Anyone can read courses"
  ON public.courses
  FOR SELECT
  TO anon
  USING (true);
```

**2. `src/components/HomePage.tsx` — 未登录时隐藏个人数据模块**

未登录时隐藏以下模块（数据为空没意义）：
- 每周进度
- 最近训练
- 我的喜欢 / 最近播放
- 连续打卡

保留展示：
- 分类快捷入口
- 今日计划（显示"去课程库挑选"的空状态）
- 为你推荐

### 不变的部分
- `useCourses` hook 不变（不依赖 user）
- 其他表（workout_logs、favorites 等）保持 `authenticated` 策略不变
- 课程库页面自动修复（也用 `useCourses`）

