

## 修复：Tab 切换置顶 vs 子页面返回恢复滚动

### 问题

当前逻辑在 `activeTab` 变化时恢复保存的滚动位置，但这对两种场景不加区分：
1. **Tab 切换**（点底部导航栏）— 应该置顶
2. **子页面返回**（从 CourseDetail/CategoryAll 返回）— 应该恢复位置

### 方案

区分"tab 切换"和"子页面返回"：

- 在 `scrollPositions.ts` 中增加一个标志 `isTabSwitch`，默认 `false`
- 在 `BottomTabBar` 的 `onTabChange` 回调中，先设置 `isTabSwitch = true`，再切换 tab
- 在 `Index.tsx` 的 scroll restore `useEffect` 中：
  - 如果 `isTabSwitch === true`：置顶（scrollTo 0），并清除该 tab 的保存位置，重置标志
  - 如果 `isTabSwitch === false`：恢复保存的滚动位置（从子页面返回的场景）

### 改动

| 文件 | 改动 |
|---|---|
| `src/lib/scrollPositions.ts` | 增加 `export let isTabSwitch = false` 及 setter 函数 |
| `src/pages/Index.tsx` | restore 逻辑中判断 `isTabSwitch`，true 则置顶并重置标志 |
| `src/components/BottomTabBar.tsx` | `onTabChange` 前先调用 `setIsTabSwitch(true)` |

