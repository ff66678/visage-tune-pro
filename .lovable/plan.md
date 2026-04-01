

## 多语言 Bug 修复（3处）

### Bug 1：分析页推荐课程的 difficulty 没翻译

**位置**：`src/components/AnalysisPage.tsx` 第185行

`{course.difficulty}` 直接显示数据库原始值（入门/中级/进阶），没用 `t()` 包裹。

**修复**：改为 `{t("difficulty." + course.difficulty)}`

### Bug 2：分析页推荐商品的 tag 和 name 没翻译

**位置**：`src/components/AnalysisPage.tsx` 第204行、207行

- `{product.tag}` 没用 `t("tag." + product.tag)` 包裹
- `{product.name}` 是数据库动态内容，需要和课程一样建翻译表，或者用前端映射

商品数量较少且固定，方案：
- **tag**：用 `t("tag." + product.tag)` 包裹（已有 tag 翻译映射）
- **name/description**：创建 `product_translations` 表，与课程翻译方案一致，插入各语言的商品名称翻译数据

### Bug 3：首页"今日计划"课程的 tag 已用 `t()` 翻译（第224行），但分析页的相同逻辑漏了

已在 Bug 2 中覆盖。

---

### 改动汇总

| 文件 | 改动 |
|---|---|
| 数据库迁移 | 创建 `product_translations` 表并插入翻译数据 |
| `src/hooks/useProducts.ts` | 添加语言感知，合并 `product_translations` |
| `src/components/AnalysisPage.tsx` | difficulty 用 `t()` 包裹；tag 用 `t()` 包裹 |

