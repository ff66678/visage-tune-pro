

## Plan: 多语言国际化 (i18n)

### 概述
为整个应用添加多语言支持，支持5种语言：简体中文、繁體中文、English、日本語、한국어。使用 React Context + JSON 翻译文件的轻量方案。

### 架构设计

```text
src/
├── i18n/
│   ├── LanguageContext.tsx    ← 语言上下文 + Provider
│   ├── translations/
│   │   ├── zh-CN.ts          ← 简体中文（默认）
│   │   ├── zh-TW.ts          ← 繁體中文
│   │   ├── en.ts             ← English
│   │   ├── ja.ts             ← 日本語
│   │   └── ko.ts             ← 한국어
│   └── useTranslation.ts     ← hook: const { t } = useTranslation()
```

### 改动文件

**1. 新建 `src/i18n/LanguageContext.tsx`**
- 创建 `LanguageContext`，存储当前语言，持久化到 `localStorage`
- 提供 `useLanguage()` hook 返回 `{ language, setLanguage }`
- 提供 `useTranslation()` hook 返回 `{ t }` 函数，按 key 取翻译

**2. 新建 5 个翻译文件**
- 每个文件导出一个扁平化的 key-value 对象
- 按模块分组 key（如 `home.greeting.morning`、`paywall.startTrial`）
- 中文文件基于现有硬编码文本，其他语言翻译对应内容

翻译覆盖范围（约 300+ 个文本 key）：
| 模块 | 涉及文件 |
|---|---|
| 首页 | HomePage.tsx |
| 课程库 | LibraryPage.tsx, CategoryAll.tsx |
| 分析 | AnalysisPage.tsx |
| 记录 | ProgressPage.tsx |
| 个人 | ProfilePage.tsx, ProfileDetailContent.tsx |
| 引导 | Onboarding.tsx（6个步骤 + 加载 + 成功页）|
| 付费墙 | Paywall.tsx |
| 会员 | Membership.tsx |
| 训练 | WorkoutPlayer.tsx |
| 课程详情 | CourseDetail.tsx |
| 收藏 | Favorites.tsx |
| 最近播放 | RecentlyPlayed.tsx |
| 礼物 | GiftPage.tsx |
| 设置 | SettingsDrawer.tsx |
| 语言设置 | LanguageSettings.tsx |
| 登录 | Auth.tsx |
| 底部栏 | BottomTabBar.tsx |
| 404 | NotFound.tsx |

**3. 修改 `src/pages/LanguageSettings.tsx`**
- 选择语言时调用 `setLanguage(code)` 保存到 context
- 读取当前语言高亮显示

**4. 修改 `src/main.tsx`**
- 用 `<LanguageProvider>` 包裹 App

**5. 修改所有含硬编码文本的组件**（约 18 个文件）
- 导入 `useTranslation`
- 将所有中文字符串替换为 `t("key")`
- 日期格式化的 locale 参数也跟随语言切换

### 翻译示例

```typescript
// zh-CN.ts
export default {
  "home.greeting.morning": "早上好，",
  "home.greeting.afternoon": "下午好，",
  "home.greeting.evening": "晚上好，",
  "home.weeklyProgress": "每周进度",
  "home.completed": "完成 {0}%",
  "home.todayPlan": "今日计划",
  "home.startNow": "立即开始",
  "home.noPlan": "今天还没有计划",
  "home.noPlanDesc": "去课程库挑选一个吧 →",
  "home.recommended": "为你推荐",
  "home.recentTraining": "最近训练",
  "home.myFavorites": "我的喜欢",
  "home.recentlyPlayed": "最近播放",
  // ... 约 300 个 key
}

// en.ts
export default {
  "home.greeting.morning": "Good morning, ",
  "home.greeting.afternoon": "Good afternoon, ",
  "home.greeting.evening": "Good evening, ",
  "home.weeklyProgress": "Weekly Progress",
  "home.completed": "{0}% Complete",
  // ...
}
```

### 技术细节

- **动态插值**：`t("home.completed", [percentage])` 替换 `{0}` 占位符
- **日期 locale**：语言映射 `{ "zh-CN": "zh-CN", "en": "en-US", "ja": "ja-JP", "ko": "ko-KR", "zh-TW": "zh-TW" }`
- **持久化**：`localStorage.setItem("app-language", code)`
- **默认语言**：简体中文

