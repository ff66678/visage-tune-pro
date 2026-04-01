

## Plan: 补全剩余未翻译内容

### 问题

经过检查，发现以下内容在切换语言后仍显示中文：

1. **首页每周进度条的星期标签**（`useWorkoutLogs.ts` 第110行）：`["一", "二", "三", "四", "五", "六", "日"]` 硬编码中文
2. **首页分类快捷按钮的文字**（`HomePage.tsx` 第154行）：`{cat}` 直接显示数据库中文值（如"眼部"、"下颌"），没有用 `t()` 包裹
3. **数据库内容**：课程标题（`course.title`）、描述（`course.description`）、时长（如"8分钟"）始终为中文

### 改动

**1. `src/hooks/useWorkoutLogs.ts`**
- `useWeeklyProgress` 不再硬编码星期标签，改为导出 index，让 UI 层用 `t()` 翻译
- 或者让 `useWeeklyProgress` 接受一个 `labels` 参数，由调用方传入翻译后的标签

**2. `src/components/HomePage.tsx`**
- 第154行：`{cat}` 改为 `{t("category." + cat)}`，用翻译映射显示分类名
- 传入翻译后的 weekday labels 给 `useWeeklyProgress`

**3. 翻译文件（5个文件）添加分类名映射**
```
"category.眼部": "Eyes"       // ja: "目元", ko: "눈가"
"category.下颌": "Jawline"    // ja: "あご", ko: "턱선"
"category.脸颊": "Cheeks"     // ja: "頬", ko: "볼"
"category.全脸": "Full Face"  // ja: "フルフェイス", ko: "풀페이스"
"category.额头": "Forehead"   // ja: "額", ko: "이마"
"category.颈部": "Neck"       // ja: "首", ko: "목"
"category.太阳穴": "Temple"   // ja: "こめかみ", ko: "관자놀이"
"category.法令纹": "Nasolabial" // ja: "ほうれい線", ko: "팔자주름"
```

**4. 数据库内容（标题、描述、时长）**
这些是动态数据，无法在前端做简单映射。如需翻译，需要在数据库层面添加多语言支持（如 `title_en`、`title_ja` 列），这是较大的改动，本次暂不处理。

### 总结
本次修复首页分类按钮和每周进度条的中文硬编码问题，添加分类名翻译映射。数据库动态内容（课程名称等）暂保持原文。

