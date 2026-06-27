# 伐由伽蓝 (VayuSamgha)

基于 [Astro 5](https://astro.build) 构建的个人技术博客，部署在 GitHub Pages。内容以数学、数值分析和有限元方法为主。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Astro 5 |
| 样式 | Tailwind CSS 4（`@tailwindcss/typography`） |
| 数学公式 | KaTeX（`remark-math` + `rehype-katex`） |
| 搜索 | Pagefind（构建时生成索引） |
| 部署 | GitHub Pages（基础路径 `/Blog`） |

## 特性

- **数学环境**：通过 `:::theorem` / `:::lemma` / `:::definition` / `:::example` / `:::remark` 自定义 fence 语法渲染定理环境
- **KaTeX 渲染**：行内 `$...$` 和块级 `$$...$$` 公式支持
- **浮动导航栏**：毛玻璃胶囊式顶部导航，带当前页指示器动画
- **文章 TOC**：文章详情页悬浮目录侧边栏，支持折叠和滚动高亮
- **标签系统**：文章标签过滤与标签聚合页
- **归档视图**：按月份分组的文章归档
- **站内搜索**：基于 Pagefind 的客户端全文搜索
- **响应式设计**：移动端 / 桌面端适配

## 目录结构

```
blog/
├── astro.config.mjs              # Astro 配置
├── package.json                  # 依赖与脚本
├── public/
│   ├── image.png                 # 站点图标
│   └── head_image/               # 首页随机背景图
├── src/
│   ├── styles/global.css         # 全局样式 + 主题变量
│   ├── content/
│   │   ├── config.ts             # 文章集合 schema
│   │   └── posts/                # Markdown 文章
│   ├── plugins/
│   │   ├── remark-environments.ts    # ::: 数学环境插件
│   │   └── rehype-clean-headings.ts  # 清理标题中 KaTeX MathML
│   ├── utils/posts.ts            # 文章数据查询函数
│   ├── components/
│   │   ├── BaseLayout.astro      # 根布局
│   │   ├── NavBar.astro          # 浮动导航栏
│   │   ├── Sidebar.astro         # 全局侧边栏
│   │   ├── PostCard.astro        # 文章卡片
│   │   ├── PostList.astro        # 文章列表
│   │   ├── TagBadge.astro        # 标签胶囊
│   │   └── Footer.astro          # 页脚
│   └── pages/
│       ├── index.astro           # 首页
│       ├── archives.astro        # 归档页
│       ├── about.astro           # 关于页
│       ├── rss.xml.js            # RSS 订阅源
│       ├── posts/[...slug].astro # 文章详情页
│       └── tags/
│           ├── index.astro       # 标签首页
│           └── [tag].astro       # 标签筛选页
└── dist/                         # 构建输出
```

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建 + Pagefind 索引生成
npm run preview   # 预览构建结果
```

## 文章 Frontmatter

```yaml
title: "文章标题"
date: 2026-05-28
tags: ["数学", "有限元"]
description: "文章摘要（可选）"
draft: false                    # true 则构建时忽略
```

## 数学环境语法

```
:::theorem[定理名称]
定理内容，支持 $...$ 和 $$...$$ 公式。
:::

:::lemma
引理内容 ...
:::

:::definition[定义名称]
定义内容 ...
:::

:::example
例子内容 ...
:::

:::remark
注记内容 ...
:::
```

支持的环境类型：`theorem`、`lemma`、`definition`、`example`、`remark`，每种环境有对应的颜色标识。
