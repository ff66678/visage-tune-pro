

## 未付费用户点击内容跳转付费墙

### 方案
利用 `AuthContext` 中已有的 `paywallCompleted` 状态，在用户点击课程内容时判断是否已付费。未付费用户跳转到 `/paywall`，已付费用户正常进入内容页。

### 实施步骤

**1. 修改 `HomePage.tsx`**
- 引入 `useAuth` 获取 `paywallCompleted`
- 今日计划"立即开始"按钮：未付费时跳转 `/paywall`，已付费时跳转课程详情
- 推荐课程卡片点击：同样逻辑

**2. 修改 `CourseDetail.tsx`**
- 引入 `useAuth` 获取 `paywallCompleted`
- 课程详情页的"开始训练"按钮：未付费时跳转 `/paywall`，已付费时进入 `/workout/:id`

**3. 修改 `LibraryPage.tsx`**（如果有课程点击入口）
- 同样增加付费检查逻辑

### 涉及文件
- `src/components/HomePage.tsx` — 课程卡片和今日计划按钮增加付费检查
- `src/pages/CourseDetail.tsx` — 开始训练按钮增加付费检查
- `src/components/LibraryPage.tsx` — 如有点击入口同样处理

