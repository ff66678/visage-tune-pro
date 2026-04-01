

## Plan: 补全未翻译内容

### 问题分析

当前翻译遗漏主要有两类：

**A. 数据库内容（课程标题、描述、难度、分类、标签等）**
课程数据存储在数据库中，全部是中文。标题和描述内容丰富，不适合在前端做映射翻译。

**B. 代码中对中文数据库值的硬编码比较**
- `LibraryPage.tsx` 第11-15行：`difficultyColor()` 直接比较 "初级"/"中级"/"高级"
- `HomePage.tsx` 第14-18行：`categoryIcons` 用中文 key（"力量"/"有氧"/"瑜伽"）
- `LibraryPage.tsx` 第22-30行：`filterKeys` 中的 `dbValue` 是中文（"全部"/"眼部" 等）
- `LibraryPage.tsx` 第44行/第95-96行/第106行：`activeFilter` 默认值和比较用中文 "全部"

### 方案

对于数据库内容（标题、描述等），不在前端翻译（数据量大且动态）。对于 **UI 层面可映射的固定字段**（difficulty、category），在前端添加翻译映射。

### 改动

**1. 翻译文件（5个文件）添加 difficulty 和 category 映射 key**

```typescript
// 新增 key 示例
"difficulty.初级": "初级",        // en: "Beginner", ja: "初級", ko: "초급"
"difficulty.中级": "中级",        // en: "Intermediate", ja: "中級", ko: "중급"  
"difficulty.高级": "高级",        // en: "Advanced", ja: "上級", ko: "고급"
"category.力量": "力量",         // en: "Strength", ja: "筋力", ko: "근력"
"category.有氧": "有氧",         // en: "Cardio", ja: "有酸素", ko: "유산소"
"category.瑜伽": "瑜伽",         // en: "Yoga", ja: "ヨガ", ko: "요가"
```

**2. `src/components/LibraryPage.tsx`**
- `difficultyColor()`：改为按 DB 值做 switch（不变，因为比较的是 DB 值不是翻译值）
- 显示 difficulty 时用 `t("difficulty." + course.difficulty)` 包裹
- 在课程卡片中显示的 category/difficulty 文本都通过 `t()` 包裹

**3. `src/components/HomePage.tsx`**
- `categoryIcons` 保持中文 key（因为匹配 DB 值），不影响功能
- 课程卡片中显示的 difficulty 文本通过 `t()` 包裹

**4. `src/pages/CourseDetail.tsx`**
- 课程详情页的 difficulty 显示用 `t()` 包裹
- tag 也添加翻译映射

**5. `src/pages/WorkoutPlayer.tsx`**
- 已经用了 `course?.title`，无需改动（DB内容保持原文）

### 不翻译的内容

- 课程标题（`course.title`）— 数据库动态内容
- 课程描述（`course.description`）— 数据库动态内容  
- 课程时长（`course.duration`，如 "8分钟"）— 数据库动态内容
- `target_audience`、`expected_effect` — 数据库动态内容

这些内容如果要多语言，需要在数据库层面支持（添加多语言列或翻译表），属于更大的改动范围。

### 总结

本次修改：为 difficulty（初级/中级/高级）、category 名称等**固定枚举值**添加前端翻译映射，确保切换语言后这些标签正确显示。数据库内容（课程标题、描述等）暂保持中文原文。

