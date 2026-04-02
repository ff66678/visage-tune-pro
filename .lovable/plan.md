
目标：修复“从课程页返回时顶部背景栏还会跳”的根因，同时补上当前 UX 优化后引入的构建错误。

1. 先修构建错误
- 文件：`src/index.css`
- 根因：`.active-press` 里使用了 `@apply active:scale-[0.97]`。Tailwind 在 `@apply` 中对这种带 `active:` 变体和任意值的组合支持不稳定，极可能就是这次 build failed 的来源。
- 修复：改成普通 CSS，不再用 `@apply`，例如直接写：
  - `transition: transform 150ms;`
  - `.active-press:active { transform: scale(0.97); }`

2. 课程页返回时顶部栏“跳”的底层原因
- 不是单一问题，是两个机制叠加：
  1) `Index.tsx` 在“非 tab 切换”的情况下，会给整个 tab 页面容器加 `animate-slide-in-left`
  2) 首页顶部栏本身是 `sticky + backdrop-blur`
- 当从课程详情返回首页时，用户看到的不是只有内容恢复，而是“整个首页连同 sticky 顶栏一起做左滑入场”。由于顶部栏带半透明和模糊，视觉上会比普通内容更容易察觉“跳一下”。
- 另外，`HomePage.tsx` 虽然加了 `useLayoutEffect` 读取 `scrollTop`，但它和 `Index.tsx` 的滚动恢复仍存在挂载时序竞争：子组件先按默认状态渲染一帧，再被父层恢复滚动/动画覆盖，仍可能出现头部状态切换感。

3. 正确修复思路：返回首页时不要再给首页做“重新入场动画”
- 文件：`src/pages/Index.tsx`
- 调整逻辑：
  - 保留“tab 切换时”的淡入逻辑
  - 保留特殊页面（如训练播放器）通过 `skipNextAnimation` 返回时跳过动画
  - 但对“普通子页面返回到首页/tab 页”的场景，不再默认执行 `animate-slide-in-left`
- 具体做法：
  - 在 `useLayoutEffect` 中，`else` 分支不要再一律：
    - `el.classList.add("animate-slide-in-left")`
  - 改为只做“同步恢复 scrollTop”，不做容器入场动画
- 结果：
  - 返回首页时，只恢复原有滚动位置
  - 顶栏不会作为整页的一部分重新滑入
  - 顶部背景栏的“跳动感”会直接消失

4. 让首页顶部栏初始状态完全跟随已恢复的滚动位置
- 文件：`src/components/HomePage.tsx`
- 目前已经有 `useLayoutEffect`，方向是对的，但还可以更稳：
  - `scrolled` 的初始值直接从 `scrollPositions.get(0)` 推导，而不是固定 `false`
  - 继续保留 `useLayoutEffect`，用真实 `scrollTop` 在挂载前再校正一次
- 建议改成：
  - `const [scrolled, setScrolled] = useState(() => (scrollPositions.get(0) || 0) > 20);`
- 这样即使组件比父层更早进入渲染，首帧也更接近最终状态，进一步减少闪动。

5. 同步检查并统一其他 tab 页，避免后续出现同类问题
- 文件：
  - `src/components/AnalysisPage.tsx`
  - `src/components/ProgressPage.tsx`
  - `src/components/LibraryPage.tsx`
- 处理方式：
  - Library 已经用了基于 `scrollPositions.get(1)` 的初始值，可保留
  - Analysis / Progress 也改成和 Home 一样的模式：初始值从各自 tab 的缓存位置推导，再用 `useLayoutEffect` 校正
- 目的：
  - 避免未来从子页面返回分析页/进度页时出现相同“头部先错后正”的跳变

6. 关于 `backdrop-blur` 的补充优化
- 文件：`src/components/HomePage.tsx`
- 这次主因不是 blur 本身，而是“blur 顶栏跟着整页做返回动画”。
- 在取消 Index 返回动画后，大概率已经足够。
- 如果还想继续稳一点，可把首页顶栏的 `transition-all` 缩窄成只过渡 padding/background：
  - 用 `transition-[padding,background-color]`
  - 避免 blur 参与过多插值
- 这属于二次打磨，不是主修复点。

7. 额外清理一个潜在警告
- 控制台里有：
  - `Function components cannot be given refs... Check the render method of Index. BottomTabBar...`
- 这说明某处有 ref 误传给 `BottomTabBar`
- 本轮重点不是它，但建议顺手检查 `Index` / `BottomTabBar` 周边 JSX，避免隐藏的类型或构建问题继续干扰排查。

实施后预期效果
- 从课程详情返回首页时：首页不再整体左滑重新入场
- 顶部背景栏不会再“先跳一下再稳定”
- 首页顶栏会直接以正确的 `scrolled` 状态出现
- 当前 build failed 也会一起修掉

涉及文件
- `src/pages/Index.tsx`
- `src/components/HomePage.tsx`
- `src/components/AnalysisPage.tsx`
- `src/components/ProgressPage.tsx`
- `src/index.css`

技术细节
```text
当前问题链路：
课程页返回
→ Index 重新挂载/重新激活
→ Index 给整个 tab 页面加 slide-in-left
→ sticky 顶栏也被带着一起动画
→ 顶栏本身又有 bg/backdrop-blur + pt 收缩逻辑
→ 用户看到“顶部背景栏跳一下”

修复后链路：
课程页返回
→ Index 仅恢复 scrollTop，不做整页返回动画
→ HomePage 首帧根据缓存 scroll 直接得到正确 scrolled
→ 顶栏稳定显示，无跳变
```
