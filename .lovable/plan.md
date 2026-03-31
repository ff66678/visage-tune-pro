

## Plan: 卡片背景颜色调亮

### 问题
统计资料、连续记录、鼓励等卡片使用 `bg-surface-elevated`（偏深灰），与整体暖白风格不搭。

### 改动文件
**`src/components/ProfileDetailContent.tsx`**

### 具体改动
将所有卡片的 `bg-surface-elevated` 替换为 `bg-card`（纯白 `0 0% 100%`），使卡片更亮、更干净，与 APP 整体温暖米白风格协调。

涉及位置：
- 统计资料卡片（约第 110 行）
- 连续记录卡片（约第 149 行）
- 鼓励卡片（约第 261 行）
- 最近练习缩略图（约第 283 行）

