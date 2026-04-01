

## Plan: 修复 intensity 未翻译的底层原因

### 根因分析

第176行代码：`t("home.intensity", [todayPlan.intensity])`

问题在于 `todayPlan.intensity` 是数据库原始中文值（"高"、"中"、"中等"、"低"），直接作为参数插入翻译模板。英文模板是 `"{0} intensity"`，所以结果是 **"高 intensity"** — 中英混杂。

`course_translations` 表没有 `intensity` 列，所以翻译合并逻辑不会覆盖它。

### 修复方案

由于 intensity 只有4个固定值，用前端翻译映射最简洁：

**1. 5个翻译文件各添加 intensity 映射**

```
"intensity.高": "High"      // ja: "高", ko: "높음", zh-TW: "高"
"intensity.中": "Medium"     // ja: "中", ko: "중간"
"intensity.中等": "Medium"   // ja: "中程度", ko: "중간"
"intensity.低": "Low"        // ja: "低", ko: "낮음"
```

**2. `src/components/HomePage.tsx` 第176行**

将 `t("home.intensity", [todayPlan.intensity])` 改为 `t("home.intensity", [t("intensity." + todayPlan.intensity)])`

这样先翻译 intensity 值，再插入模板：英文结果为 "High intensity"。

### 改动汇总

| 文件 | 改动 |
|---|---|
| `src/i18n/translations/en.ts` | 添加4个 intensity 翻译 key |
| `src/i18n/translations/ja.ts` | 添加4个 intensity 翻译 key |
| `src/i18n/translations/ko.ts` | 添加4个 intensity 翻译 key |
| `src/i18n/translations/zh-CN.ts` | 添加4个 intensity 翻译 key |
| `src/i18n/translations/zh-TW.ts` | 添加4个 intensity 翻译 key |
| `src/components/HomePage.tsx` | 第176行嵌套 `t()` 调用 |

