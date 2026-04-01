

## 多语言 Bug 审查结果

发现以下问题：

---

### Bug 1：Favorites 和 RecentlyPlayed 页面的 difficulty 没有翻译

**位置**：`src/pages/Favorites.tsx` 第39行、`src/pages/RecentlyPlayed.tsx` 第39行

`{course.difficulty}` 直接显示数据库原始中文值，没有用 `t("difficulty." + course.difficulty)` 包裹。

**修复**：改为 `{t("difficulty." + course.difficulty)}`。

---

### Bug 2：Favorites 页面没有获取翻译后的课程数据

**位置**：`src/hooks/useFavorites.ts` 第15行

`useFavorites` 通过 `courses(*)` JOIN 获取课程数据，但这只拿到原始中文数据，不会合并 `course_translations` 的翻译。切换到英文后，收藏列表的课程标题、描述仍然是中文。

**修复**：在 `useFavorites` 中增加与 `useCourses` 相同的翻译合并逻辑——查询 `course_translations` 并覆盖对应字段。

---

### Bug 3：CategoryAll 页面的 difficulty 没有翻译

**位置**：`src/pages/CategoryAll.tsx` 第52行

`{routine.difficulty}` 直接显示原始中文值。

**修复**：引入 `t()` 并改为 `{t("difficulty." + routine.difficulty)}`。

---

### Bug 4：CategoryAll 缺少额头、太阳穴、法令纹的分类标签映射

**位置**：`src/pages/CategoryAll.tsx` 第15-21行

`categoryLabels` 只映射了5个分类（眼部、下颌、脸颊、颈部、全脸），缺少额头、太阳穴、法令纹。导致这三个分类页面标题显示原始中文。

**修复**：补全缺失的3个映射。

---

### Bug 5：ProfileDetailContent 的 weekLabels 有重复 key 导致 React 警告

**位置**：`src/components/ProfileDetailContent.tsx` 第157行

`weekLabels.map((l) => <div key={l}>...)` 用翻译后的文本做 key。在英文中 `profile.weekSun` = "S" 和 `profile.weekSat` = "S"、`profile.weekTue` = "T" 和 `profile.weekThu` = "T" 重复，导致控制台报 "Encountered two children with the same key" 错误。

**修复**：改用 index 做 key：`weekLabels.map((l, i) => <div key={i}>...)`。

---

### Bug 6：数据库中的 tag 值没有翻译映射

数据库中有 `下颌`、`轮廓`、`太阳穴`、`法令纹`、`脸颊`、`放松`、`眼部`、`眼部疲劳`、`颈部`、`额头`、`塑形`、`塑形提升` 等 tag 值，但翻译文件只映射了 `热门`、`新课`、`推荐` 三个。其他 tag 会直接显示中文。

**修复**：在5个翻译文件中补全所有 tag 映射。

---

### 改动汇总

| 文件 | 改动 |
|---|---|
| `src/pages/Favorites.tsx` | difficulty 用 `t()` 包裹 |
| `src/pages/RecentlyPlayed.tsx` | difficulty 用 `t()` 包裹 |
| `src/pages/CategoryAll.tsx` | 补全分类映射、difficulty 用 `t()` 包裹 |
| `src/hooks/useFavorites.ts` | 添加翻译合并逻辑 |
| `src/components/ProfileDetailContent.tsx` | weekLabels key 改用 index |
| 5个翻译文件 | 补全缺失的 tag 映射 |

