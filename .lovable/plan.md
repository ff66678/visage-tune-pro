

## 添加左滑返回手势

### 方案

创建一个 `SwipeBack` 组件，监听触摸事件，当用户从屏幕左边缘（≤30px）开始向右滑动超过阈值时，触发 `navigate(-1)` 返回。包裹在所有子页面的根元素上。

### 改动

| 文件 | 改动 |
|---|---|
| `src/components/SwipeBack.tsx` | 新建组件，监听 touchstart/touchmove/touchend，判断左边缘起滑 + 右滑距离 > 80px 则返回 |
| `src/pages/CourseDetail.tsx` | 用 `<SwipeBack>` 包裹根内容 |
| `src/pages/CategoryAll.tsx` | 同上 |
| `src/pages/Favorites.tsx` | 同上 |
| `src/pages/RecentlyPlayed.tsx` | 同上 |
| `src/pages/ProfileDetail.tsx` | 同上 |
| `src/pages/Membership.tsx` | 同上 |
| `src/pages/LanguageSettings.tsx` | 同上 |
| `src/pages/WorkoutPlayer.tsx` | 同上 |

### SwipeBack 实现逻辑

```tsx
// 核心逻辑：
// touchstart: 记录起始 X，仅当 X ≤ 30px（左边缘）时激活
// touchmove: 计算水平位移，实时平移页面内容（跟手效果）
// touchend: 若位移 > 屏幕宽度 1/3，执行 navigate(-1)；否则弹回
```

组件会给内容添加跟手的 `translateX` 效果，松手时根据滑动距离决定是完成返回还是弹回原位，体验接近 iOS 原生。

