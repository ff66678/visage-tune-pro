

## Bug: 训练一进入就触发"完成"

### 根因

`seconds` 初始值为 `0`（L50），而完成检测逻辑（L98-99）的条件是：

```
seconds === 0 && !isFinished && user && id
```

组件挂载时 `seconds=0` 已满足条件，在 course 数据加载之前就立即触发了完成逻辑、写入数据库、弹出 toast。

### 修复

在完成条件中加入 `isReady` 守卫——只有 course 数据加载完毕、timer 被正确初始化后，`seconds === 0` 才代表真正倒计时结束：

**文件**: `src/pages/WorkoutPlayer.tsx` L98-99

```
// 修改前
if (seconds === 0 && !isFinished && user && id) {

// 修改后
if (seconds === 0 && isReady && !isFinished && user && id) {
```

一行改动，精准修复。

