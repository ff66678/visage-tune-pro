

## 顶部按钮区域加半透明渐变背景

### 改动

| 文件 | 改动 |
|---|---|
| `src/pages/CourseDetail.tsx` | 顶部 portal div 添加从上到下的半透明渐变背景 |

### 具体变更

在顶部 portal 的 `<div>` 上添加渐变背景：

```tsx
<div className="fixed top-0 left-0 w-full px-6 pt-[max(3rem,env(safe-area-inset-top))] pb-3 flex justify-between items-center z-20 bg-gradient-to-b from-black/40 to-transparent">
```

- `from-black/40 to-transparent`：从上往下 40% 不透明度黑色渐变到透明，让按钮在浅色封面图上也清晰可见
- 添加 `pb-3` 让渐变区域稍微延伸，过渡更自然

