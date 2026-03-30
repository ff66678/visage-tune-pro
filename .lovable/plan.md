

## Plan: 缩小推荐卡片，一屏显示2个多

### 改动
**文件**: `src/components/HomePage.tsx`

将推荐卡片从 `min-w-[240px] h-40` 改为 `min-w-[160px] h-28`，gap 从 `gap-4` 改为 `gap-3`，这样在 390px 宽度下一屏可以看到 2 个卡片多一点。

同时缩小底部文字 padding 和字号，skeleton 也同步调小。

### 具体改动
- 第 127-128 行 skeleton: `min-w-[240px] h-40` → `min-w-[160px] h-28`
- 第 131 行容器: `gap-4` → `gap-3`
- 第 135 行卡片: `min-w-[240px] h-40` → `min-w-[160px] h-28`
- 第 143 行底部遮罩: `p-4` → `p-2.5`
- 第 147 行标题: `text-base` → `text-sm`

