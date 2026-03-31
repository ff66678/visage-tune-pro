

## Plan: 面部分析按钮改为拍照+自动分析

### 改动
**`src/components/AnalysisPage.tsx`**

1. **按钮改为触发拍照**：将底部"面部分析"按钮的 `onClick` 从 `handleAnalyze` 改为 `fileInputRef.current?.click()`，按钮文字统一为"面部分析"
2. **拍照后自动分析**：在 `handleCapture` 中，上传完成后拿到返回的 `photo_url`，自动调用 `runAnalysis.mutateAsync(photo_url)`
3. **按钮状态**：上传中显示"上传中…"，分析中显示"AI 分析中…"，空闲时显示"面部分析"
4. **移除单独的 `handleAnalyze`**：不再需要

### 交互流程
点击"面部分析" → 相机打开 → 拍照 → 自动上传 → 自动 AI 分析 → 结果展示

