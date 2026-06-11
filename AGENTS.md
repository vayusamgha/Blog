# AGENTS.md — 伐由伽蓝 (VayuSamgha) 博客项目

## 项目概述

基于 **Astro 5** 的静态个人博客，部署在 GitHub Pages（基础路径 `/Blog`）。使用 Tailwind CSS 4 排版，KaTeX 数学公式渲染，Pagefind 站内搜索。

- **语言**: 简体中文 (zh-CN)
- **包管理器**: npm
- **站点地址**: `vayusamgha.github.io/Blog`

## 关键配置文件

| 文件 | 用途 |
|---|---|
| `astro.config.mjs` | Astro 配置：base 路径 `/Blog`，remark 插件链（math → directive → environments）+ rehype-katex |
| `src/content/config.ts` | 文章集合 schema：title、date、tags、description、draft |
| `src/styles/global.css` | Tailwind 入口 + 自定义主题变量（accent、bg、surface、text、border） |
| `package.json` | 依赖：astro、tailwindcss、pagefind、katex 等 |

## 目录结构及用途

```
blog/
├── astro.config.mjs          # Astro 构建配置
├── package.json              # 项目依赖与脚本
├── tsconfig.json             # TypeScript 配置
├── AGENTS.md                 # 本文件：项目文档，供 Codex 会话参考
├── public/
│   ├── image.png             # 头像/站点图标
│   └── head_image/           # 首页 Hero 随机背景图（8 张 jpg/png/webp）
├── src/
│   ├── styles/
│   │   └── global.css        # 全局样式：Tailwind 指令 + 主题变量 + 排版自定义
│   ├── content/
│   │   ├── config.ts         # 内容集合 schema 定义
│   │   └── posts/            # Markdown 文章（如 hello-world.md、代数几何.md）
│   ├── plugins/
│   │   └── remark-environments.ts  # 自定义 remark 插件：将 ::: 指令转为定理/引理/定义/例/注记环境 HTML
│   ├── utils/
│   │   └── posts.ts          # 共享数据函数：getPosts、getTags、getStats、getArchives、getRecentPosts、filterByTag
│   ├── components/
│   │   ├── BaseLayout.astro  # 根布局：导航栏 + 搜索覆盖层 + Footer + Hero(可选)
│   │   ├── NavBar.astro      # 顶部导航栏：搜索、主页、归档、标签、关于（移动端隐藏文字）
│   │   ├── Hero.astro        # 首页大图横幅（随机背景图 + "Blog - VayuSamgha"）
│   │   ├── Sidebar.astro     # 全局侧边栏：个人信息、公告、最新文章、标签、归档
│   │   ├── PostCard.astro    # 单篇文章卡片（日期、标题、描述、标签）
│   │   ├── PostList.astro    # 文章列表 + 客户端标签过滤（两列网格）
│   │   ├── TagBadge.astro    # 可复用标签胶囊按钮
│   │   └── Footer.astro      # 页脚：版权 + 技术栈
│   └── pages/
│       ├── index.astro       # 首页：Hero + PostList（全部文章，可客户端标签过滤）
│       ├── archives.astro    # 归档页：文章按月分组，侧边栏布局
│       ├── about.astro       # 关于页：站点介绍 + 个人简介 + 联系方式
│       ├── rss.xml.js        # RSS 订阅源生成
│       ├── tags/
│       │   ├── index.astro   # 标签首页：所有标签的卡片式列表
│       │   └── [tag].astro   # 标签详情页：按标签过滤的 PostList
│       └── posts/
│           └── [...slug].astro  # 文章详情页：prose 排版 + 折叠式 TOC 侧边栏
└── dist/                     # 构建输出（含 pagefind 索引）
```

## 页面布局模式

### 列表型页面（首页、归档、标签、关于）

两栏 flex 布局：主内容区 + 右侧 Sidebar，小屏时 Sidebar 下沉到底部。

```
<div class="flex flex-col lg:flex-row gap-8">
  <div class="w-full lg:w-72 shrink-0 order-2 lg:order-1">
    <Sidebar />   <!-- 小屏在下方 -->
  </div>
  <div class="flex-1 min-w-0 order-1 lg:order-2">
    <!-- 主内容 -->
  </div>
</div>
```

### 文章详情页

单栏 prose 排版 + 悬浮 TOC 侧边栏（仅大屏显示），TOC 支持展开折叠和滚动高亮。

## 设计主题变量

定义在 `src/styles/global.css`：

| 变量 | 值 | 说明 |
|---|---|---|
| `--color-accent` | `#3b82f6` | 蓝色强调色 |
| `--color-bg` | `#fafafa` | 页面背景 |
| `--color-surface` | `#ffffff` | 卡片表面 |
| `--color-text` | `#1a1a2e` | 主文字色 |
| `--color-text-muted` | `#6b7280` | 次要文字色 |
| `--color-border` | `#e5e7eb` | 边框色 |

## 数据层

`src/utils/posts.ts` 是唯一的数据入口，所有页面通过它获取文章数据：

- `getPosts()` — 过滤草稿，按日期降序
- `getTags(posts)` — 统计标签出现次数并排序
- `filterByTag(posts, tag)` — 按标签过滤
- `getStats()` — 返回 { count, runningDays }
- `getArchives()` — 返回按月分组的 [monthName, count][]
- `getRecentPosts(limit)` — 返回最近 N 篇文章

## 文章 Frontmatter 格式

```yaml
title: "文章标题"
date: 2026-05-28
tags: ["数学", "代数几何"]
description: "文章摘要（可选）"
draft: false
```

## 定理环境（::: 语法）

文章内可使用 `:::` fence 语法创建数学环境。`remark-directive` 解析指令，`remark-environments` 将其转为带 CSS 类的 HTML。

**语法**：`:::类型[可选标题]` 开头，`:::` 结尾。支持环境类型：

| 指令 | 中文标签 | 样式色 |
|---|---|---|
| `:::theorem[...]` | 定理 | 蓝色 `#3b82f6` |
| `:::lemma[...]` | 引理 | 天蓝 `#0ea5e9` |
| `:::definition[...]` | 定义 | 翠绿 `#10b981` |
| `:::example[...]` | 例 | 紫色 `#8b5cf6` |
| `:::remark[...]` | 注记 | 琥珀 `#f59e0b` |

环境内可正常使用 KaTeX 公式（`$...$` 和 `$$...$$`）。remark 插件处理顺序为 `remarkMath → remarkDirective → remarkEnvironments`，不可调换——`remarkDirective` 必须在 `remarkEnvironments` 之前运行。

## 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建（含 pagefind 索引）
npm run preview      # 预览构建结果
```

## 设计约定

- 标题使用 `text-2xl font-bold text-text` 样式（归档、标签、关于页统一）
- 侧边栏最新文章不显示 bullet points，标题下方显示创建日期
- 标签页不显示「返回」按钮
- 文章列表使用 PostList 组件的客户端标签过滤
