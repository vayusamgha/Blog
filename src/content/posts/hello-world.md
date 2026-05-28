---
title: "Hello, World — 欢迎来到我的笔记"
date: 2026-05-28
tags: ["数学", "编程", "随笔"]
description: "第一篇笔记，测试 Markdown 渲染、代码高亮和 LaTeX 数学公式"
---

## 关于本站

这是一个个人笔记站点，使用 Markdown 书写，支持 **LaTeX 数学公式** 和代码高亮。

## 数学公式示例

行内公式：$e^{i\pi} + 1 = 0$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

贝叶斯定理：

$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

矩阵表示：

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

## 代码示例

```python
def fibonacci(n: int) -> int:
    """Return the n-th Fibonacci number."""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
```

```typescript
interface Post {
  title: string;
  date: Date;
  tags: string[];
  description?: string;
}

const posts: Post[] = await getCollection("posts");
```

## 引用

> 数学是上帝用来书写宇宙的语言。
> — Galileo Galilei

## 列表

- Astro 静态站点生成
- KaTeX 数学渲染
- Tailwind CSS 样式
- GitHub Pages 部署
