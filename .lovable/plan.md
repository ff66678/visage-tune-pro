

## Plan: 新增"分析"页面 + 底部导航改为四栏

### 概览
新增一个面部分析页面作为第三个 Tab，底部导航从三栏改为四栏：**首页 → 课程 → 分析 → 记录**。分析页参考截图设计，展示用户最近的进度照片 + AI 面部分析结果（弹性评分、整体健康等级）+ 为你推荐课程。

### 需要改动的文件

**1. 数据库迁移 — 创建 `face_analyses` 表**
存储每次分析结果：
- `id`, `user_id`, `photo_url`, `elasticity_score`(int), `health_grade`(varchar), `nasolabial_level`(varchar), `jawline_level`(varchar), `eye_contour_score`(int), `analysis_date`, `created_at`
- RLS 策略：用户只能读写自己的数据

**2. 创建后端函数 — `supabase/functions/analyze-face/index.ts`**
- 接收用户上传的照片 URL
- 调用 AI 模型（Lovable AI）分析面部特征，返回各项评分
- 将结果存入 `face_analyses` 表并返回

**3. 新建 `src/hooks/useFaceAnalysis.ts`**
- `useFaceAnalyses()` — 查询用户历史分析记录
- `useLatestAnalysis()` — 获取最新一条分析
- `useRunAnalysis()` — mutation，调用 edge function 触发新分析

**4. 新建 `src/components/AnalysisPage.tsx`**
参考截图布局，保持 APP 暖色调：
- **顶部区域**：显示最近一张进度照片（大圆角卡片），照片上叠加标注点（眼部轮廓、法令纹、下颌线条等评分标签）
- **评分卡片**：两列并排 — 弹性评分（数字 + 趋势）和整体健康等级（字母 + 趋势）
- **为你推荐**：根据分析薄弱项推荐对应课程（如下颌评分低就推荐下颌课程）
- **无数据状态**：引导用户去"记录"页拍照，然后回来分析
- 提供"开始分析"按钮触发 AI 分析

**5. 修改 `src/components/BottomTabBar.tsx`**
- 四个 Tab：`Home`(首页)、`BookOpen`(课程)、`ScanFace`(分析)、`Camera`(记录)
- 图标从 lucide-react 选取合适的

**6. 修改 `src/pages/Index.tsx`**
- pages 数组改为 `[HomePage, LibraryPage, AnalysisPage, ProgressPage]`

### 数据流
```text
进度照片(progress_photos) → 用户点击"分析" → edge function 调用 AI → 结果存 face_analyses → 页面展示
```

### 不变的部分
- 首页、课程库、记录页功能不变
- 只是"库"改名为"课程"，"进度"改名为"记录"

