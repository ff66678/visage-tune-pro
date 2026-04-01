

## 用户体验优化方案

### 1. 页面切换动画流畅度

| 改动 | 文件 | 说明 |
|---|---|---|
| 图片懒加载 | `HomePage.tsx`, `LibraryPage.tsx` | 所有课程卡片和列表图片添加 `loading="lazy"` 减少页面切换时的卡顿 |
| 课程卡片图片渐显 | `src/index.css` | 添加 `.img-fade` class，图片加载完成后从透明渐显为不透明，避免图片突然出现 |
| Tab 切换动画优化 | `Index.tsx` | Tab 切换改用 `animate-fade-in-opacity`（纯透明度）替代 `animate-fade-in`（带 translateY），水平 Tab 切换不应有垂直位移感 |

### 2. 加载体验

| 改动 | 文件 | 说明 |
|---|---|---|
| 课程详情骨架屏优化 | `CourseDetail.tsx` | 加载状态改为更贴近实际布局的骨架屏：全宽封面图 + 圆角卡片 + 按钮区，减少布局抖动 |
| 首页骨架屏丰富化 | `HomePage.tsx` | 为"今日计划"和"推荐课程"各添加更贴合实际形状的骨架屏 |

### 3. 滚动与触控交互

| 改动 | 文件 | 说明 |
|---|---|---|
| 横向滚动列表 snap | `HomePage.tsx`, `LibraryPage.tsx` | 推荐课程、热门排行等横向列表添加 `scroll-snap-type: x mandatory` 和子项 `scroll-snap-align: start`，滚动停止时自动对齐卡片 |
| 按钮触控反馈 | 全局 `index.css` | 添加 `.active-press` 工具类：`active:scale-[0.97] transition-transform duration-150`，统一所有可点击卡片的按压反馈 |
| 课程详情页顶部按钮触控 | `CourseDetail.tsx` | 三个顶部按钮添加 `active:scale-90` 按压缩放效果 |

### 4. 视觉细节打磨

| 改动 | 文件 | 说明 |
|---|---|---|
| 底部 Tab 栏阴影 | `BottomTabBar.tsx` | 顶部边框从 `border-foreground/5` 改为更柔和的 `shadow-[0_-1px_8px_rgba(0,0,0,0.04)]`，视觉更精致 |
| 推荐卡片圆角统一 | `HomePage.tsx` | 推荐课程卡片圆角从 `rounded-2xl` 统一为 `rounded-3xl`，与首页其他卡片风格一致 |
| 课程详情卡片阴影 | `CourseDetail.tsx` | 信息卡片从 `shadow-sm` 升级为 `shadow-md`，增加层次感 |
| 分类快捷入口图标底色 | `HomePage.tsx` | 分类按钮的图标底色从 `bg-surface` 改为 `bg-card`，增加与背景的对比度 |

### 技术细节

**图片渐显 CSS（index.css）**：
```css
.img-fade {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.img-fade[data-loaded="true"] {
  opacity: 1;
}
```
配合 `onLoad` 事件设置 `data-loaded`。

**横向 snap 滚动**：
```tsx
<div className="flex gap-3 overflow-x-auto snap-x snap-mandatory ...">
  <div className="snap-start ...">
```

**涉及文件总览**：
- `src/index.css` — 新增工具类
- `src/pages/Index.tsx` — Tab 切换动画
- `src/pages/CourseDetail.tsx` — 骨架屏 + 触控 + 阴影
- `src/components/HomePage.tsx` — 懒加载 + snap + 圆角 + 骨架屏
- `src/components/LibraryPage.tsx` — 懒加载 + snap
- `src/components/BottomTabBar.tsx` — 阴影优化

