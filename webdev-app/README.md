# D-FINE Learning Studio

这是仓库中的新版 D-FINE 教学网站源代码，采用 React + Vite + TypeScript。它与任何个人实验目录、训练配置或研究数据完全分离，课程只负责帮助学习者从检测任务一路理解到 FDR 与 GO-LSD。

## 本地运行

```bash
cd webdev-app
pnpm install
pnpm dev
```

## 内容结构

课程内容集中在 `client/src/lib/course.ts`，页面交互在 `client/src/pages/Home.tsx`，全局视觉系统在 `client/src/index.css`。网站采用单条连续学习主线，而不是 Phase 或实验任务列表。

## 说明

`webdev-app` 是教学站的前端源代码。用户的 D-FINE 实验代码、数据集、训练日志和私人配置不属于本项目，也不应提交到本仓库。
