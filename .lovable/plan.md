

## Plan: 添加"我的喜欢"和"最近播放"入口

### 需要做的事

在打卡卡片上方添加两个并排的快捷入口卡片："我的喜欢"和"最近播放"，点击后跳转到对应页面。同时需要创建收藏功能的数据库支持。

### 1. 创建 `favorites` 表（数据库迁移）
```sql
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
-- 用户只能读写自己的收藏
CREATE POLICY "Users can read own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

### 2. 新建 `src/hooks/useFavorites.ts`
- `useFavorites()`：查询当前用户的收藏课程列表（join courses 表）
- `useToggleFavorite()`：添加/取消收藏的 mutation

### 3. 新建两个页面
- **`src/pages/Favorites.tsx`**：我的喜欢页面，展示收藏的课程列表
- **`src/pages/RecentlyPlayed.tsx`**：最近播放页面，复用 `useRecentCourses` 展示完整历史

### 4. 修改 `src/App.tsx`
添加 `/favorites` 和 `/recently-played` 路由

### 5. 修改 `src/components/HomePage.tsx`
在打卡卡片上方添加两个并排卡片：

```text
┌──────────────┐ ┌──────────────┐
│ ♡ 我的喜欢    │ │ ▶ 最近播放    │
│ 3 个课程      │ │ 5 个记录      │
└──────────────┘ └──────────────┘
```

使用 `grid grid-cols-2 gap-3`，每个卡片带图标、标题和计数，点击跳转对应页面。

### 6. 在课程详情页添加收藏按钮
修改 `src/pages/CourseDetail.tsx`，在合适位置加一个心形收藏按钮，调用 `useToggleFavorite`。

