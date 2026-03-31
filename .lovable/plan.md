

## Plan: 分析页底部添加推荐商品模块

### 概览
在分析页底部新增"为你推荐"商品卡片区域，参考截图的横向滚动卡片设计（标签 + 图片 + 名称 + 价格 + 添加按钮）。商品数据存在数据库中。

### 改动

**1. 数据库迁移 — 创建 `products` 表**
```sql
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  tag text,              -- 如"针对下颌线条"、"针对眼部提升"
  category text,
  purchase_url text,     -- 外部购买链接
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);
```

**2. 新建 `src/hooks/useProducts.ts`**
- `useProducts()` — 查询所有 active 商品，按 sort_order 排序

**3. 修改 `src/components/AnalysisPage.tsx`**
在"为你推荐课程"下方新增商品区域：
- 标题行："推荐好物" + "查看全部"
- 横向滚动卡片列表（`overflow-x-auto flex gap-3`），每个卡片：
  - 左上角彩色标签（tag，如"针对下颌线条"）
  - 商品图片（圆角）
  - 商品名称
  - 价格（¥xx.xx）
  - 右下角圆形"+"按钮（点击跳转 purchase_url）
- 风格与 APP 暖色调一致，卡片用 `bg-card` + `border-border`

