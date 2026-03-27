

## 修复首页头像留白

### 问题
Avatar 组件有 `p-0.5` 内边距，导致头像图片无法占满圆形区域，出现空白间隙。

### 方案
移除 `p-0.5`，改用 `ring` 实现边框效果，这样头像图片可以完全填满容器。

### 改动
**`src/components/HomePage.tsx` 第 46 行**
- 将 `border-[1.5px] border-primary p-0.5` 替换为 `ring-[1.5px] ring-primary`
- `ring` 不占用内部空间，头像图片自然占满

