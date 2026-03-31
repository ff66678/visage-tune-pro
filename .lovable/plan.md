

## Plan: 接入真实分享功能

### 改动文件
**`src/pages/CourseDetail.tsx`**

### 方案
使用 Web Share API（`navigator.share`），这是移动端原生支持的分享接口，可以调起系统分享面板（微信、短信、复制链接等）。

点击分享按钮时：
1. 优先使用 `navigator.share()`，传入课程标题、描述和当前页面 URL
2. 如果浏览器不支持 Web Share API（桌面端），fallback 为复制链接到剪贴板，并用 toast 提示"链接已复制"

### 具体改动
- 给分享按钮添加 `onClick` 处理函数 `handleShare`
- 函数内容：
```typescript
const handleShare = async () => {
  const shareData = {
    title: course?.title,
    text: course?.description || course?.title,
    url: window.location.href,
  };
  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: "链接已复制" });
  }
};
```
- 引入 `useToast` 用于 fallback 提示

