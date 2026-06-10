---
title: "椭圆问题的正则性估计"
date: 2026-06-10
tags: ["数学", "偏微分方程", "椭圆方程"]
description: "利用差分商方法（Nirenberg 平移法）建立二阶椭圆方程的 H² 正则性估计"
---

## 1. 问题提法

我们考虑如下二阶椭圆型方程：

$$
\mathcal{L}u := -\nabla\cdot(A\nabla u) + k^2 u = -k^2 f, \tag{1}
$$

其中 $A = (a^{ij}(x))$ 是一致椭圆且满足 Lipschitz 条件的系数矩阵，即存在 $\lambda, \Lambda > 0$ 使得

$$
\lambda |\xi|^2 \le a^{ij}(x)\xi_i\xi_j \le \Lambda |\xi|^2,\qquad \forall \xi\in\mathbb{R}^d,\;\forall x\in\Omega,
$$

且 $a^{ij} \in \operatorname{Lip}(\overline\Omega)$。**等价地写（使主要的项目没有系数方便估计）：**

$$
\mathcal{L}u := k^{-2}\nabla\cdot(A\nabla u) - u = f. \tag{2}
$$

这种形式自然地出现在 Helmholtz 方程以及 PML（完美匹配层）截断的方程中。

我们的目标是建立 **$H^2$ 正则性估计**：对边界 $\partial\Omega \in C^{1,1}$ 的有界区域 $\Omega$，有

$$
\|u\|_{H^2(\Omega)} \le C \bigl( \|u\|_{H^1(\Omega)} + \|f\|_{L^2(\Omega)} \bigr), \tag{3}
$$

其中 $C = C(\Omega, \lambda, \Lambda, \|\nabla a^{ij}\|_{L^\infty})$，而带权重的 $H^2$ 范数定义为

$$
\|u\|_{H^2(\Omega)}^2 := \sum_{|\alpha| \le 2} k^{-2|\alpha|}\|D^\alpha u\|_{L^2(\Omega)}^2,
$$

即各阶导数的权重为 $k^{-|\alpha|}$。这一约定与方程 (2) 的缩放一致：方程两边同除 $k^2$ 后，主部带有系数 $k^{-2}$，因此梯度项以 $k^{-1}$ 加权，Hessian 项以 $k^{-2}$ 加权，自然地使各阶导数在能量意义下可比。

## 2. 局部化与差分商方法

正则性论证的核心工具是 **差分商方法**（Nirenberg 平移法）。其基本思路是：用差分商逼近切向导数，通过椭圆方程将切向的正则性提升为全梯度的正则性，再利用法向导数由方程本身控制这一事实。

### 2.1 局部化与记号

取两个开集 $G_1 \subset\subset G_2 \subset\subset \Omega$（即 $\overline{G}_1 \subset G_2,\;\overline{G}_2 \subset \Omega$，使得 $G_2$ 的闭包与边界分离）。我们证明局部内估计：

$$
\|u\|_{H^2(G_1)} \le C \bigl( \|u\|_{H^1(\Omega)} + \|f\|_{L^2(\Omega)} \bigr). \tag{4}
$$

令 $\chi \in C_c^\infty(G_2)$ 为截断函数，满足 $0 \le \chi \le 1$ 且在 $G_1$ 上 $\chi \equiv 1$。

对方向 $e_i$（$1 \le i \le d$）及步长 $h > 0$ 足够小（使得 $x+he_i$ 仍在截断区域内），定义前向差分商

$$
\Delta_h u(x) := \frac{u(x+he_i) - u(x)}{h},
$$

以及后向差分商 $\Delta_{-h}$（即 $\Delta_{-h}u(x) = \frac{u(x) - u(x-he_i)}{h}$）。二者满足分部积分公式：

$$
\int \Delta_h u \cdot v \,dx = -\int u \cdot \Delta_{-h} v \,dx.
$$

### 2.2 Gårding 不等式

方程 (2) 的主部对应的双线性形式为

$$
a_{\Omega}(u,v) := \int_{\Omega} \Bigl( k^{-2} A\nabla u \cdot \nabla v + uv \Bigr) \,dx.
$$

由于 $A$ 一致椭圆，双线性形式 $a_\Omega$ 满足 Gårding 不等式：存在 $C_g > 0$（依赖于 $\lambda$, $k$）使得对任意 $v \in H_0^1(\Omega)$，

$$
\|v\|_{L^2(\Omega)}^2 \le \frac{1}{C_g} \Bigl( \bigl| a_{\Omega}(v,v) \bigr| + \|v\|_{L^2(\Omega)}^2 \Bigr). \tag{5}
$$

特别地，取 $v = \Delta_h(\chi u)$（注意截断后 $\chi u$ 紧支于 $\Omega$ 内部，因此 $\Delta_h(\chi u) \in H_0^1$ 对足够小的 $h$ 成立），有

$$
\|\Delta_h(\chi u)\|_{L^2(\Omega)}^2 \le \frac{1}{C_g} \Bigl( \bigl| a_{\Omega}(\Delta_h(\chi u), \Delta_h(\chi u)) \bigr| + \|\Delta_h(\chi u)\|_{L^2(\Omega)}^2 \Bigr).
$$

## 3. 差分商的能量不等式

### 3.1 交换子估计

关键的一步是计算双线性形式与差分商的交换子。考虑

$$
\begin{aligned}
&\bigl| a_{\Omega}(\Delta_h(\chi u), v) + a_{\Omega}(\chi u, \Delta_{-h} v) \bigr| \\
&= \Bigl| \int_{\Omega} k^{-2} A(x+he_i) \nabla(\chi u)(x+he_i) \cdot \nabla v(x) \,dx
   - \int_{\Omega} k^{-2} A(x) \nabla(\chi u)(x+he_i) \cdot \nabla v(x) \,dx \Bigr| \\
&= \Bigl| \int_{\Omega} k^{-2} \frac{A(x+he_i) - A(x)}{h} \nabla(\chi u)(x+he_i) \cdot \nabla v(x) \,dx \Bigr|.
\end{aligned}
$$

由于 $A \in \operatorname{Lip}$，存在一致的 $L_A > 0$ 使得

$$
\Bigl| \frac{A(x+he_i) - A(x)}{h} \Bigr| \le \|\nabla A\|_{L^\infty} \le L_A,
$$

因此

$$
\bigl| a_{\Omega}(\Delta_h(\chi u), v) + a_{\Omega}(\chi u, \Delta_{-h} v) \bigr|
\le C k^{-2} \|\nabla(\chi u)\|_{L^2} \|\nabla v\|_{L^2}. \tag{6}
$$

进而有

$$
\bigl| a_{\Omega}(\Delta_h(\chi u), v) \bigr|
\le \bigl| a_{\Omega}(\chi u, \Delta_{-h} v) \bigr| + C \|\chi u\|_{H^1_{k^2}} \|v\|_{H^1_{k^2}}, \tag{7}
$$

其中 $\|w\|_{H^1_{k^2}}^2 := \|w\|_{L^2}^2 + k^{-2}\|\nabla w\|_{L^2}^2$ 为带权重的 $H^1$ 范数。

### 3.2 将双线性形式转化为右端项

双线性形式在弱意义下与算子 $\mathcal{L}$ 的关系为

$$
a_{\Omega}(u,v) = (-\mathcal{L}u, v) = (-f, v).
$$

因此，取 $u$ 为 $\chi u$（它在 $G_2$ 外为零），有

$$
a_{\Omega}(\chi u, \Delta_{-h} v) = (-\mathcal{L}(\chi u), \Delta_{-h} v) =: (f_1, \Delta_{-h} v),
$$

其中令

$$
f_1 := \mathcal{L}(\chi u).
$$

下面计算 $\mathcal{L}(\chi u)$ 的具体表达式。由算子定义 (2)：

$$
\begin{aligned}
\mathcal{L}(\chi u) &= k^{-2} \nabla\cdot\bigl( A \nabla(\chi u) \bigr) - \chi u \\
&= k^{-2} \nabla\cdot\bigl( A(u\nabla\chi + \chi\nabla u) \bigr) - \chi u \\
&= k^{-2} \nabla\cdot( A\nabla\chi \, u ) + k^{-2} \nabla\cdot( A\chi \nabla u ) - \chi u.
\end{aligned}
$$

注意第二项可以进一步展开：

$$
k^{-2} \nabla\cdot( A\chi \nabla u ) = k^{-2} \chi \nabla\cdot(A\nabla u) + k^{-2} A\nabla\chi \cdot \nabla u.
$$

代入得

$$
\begin{aligned}
\mathcal{L}(\chi u)
&= k^{-2} \nabla\cdot( A\nabla\chi \, u ) + k^{-2} \chi \nabla\cdot(A\nabla u) + k^{-2} A\nabla\chi \cdot \nabla u - \chi u \\
&= \chi\bigl(k^{-2}\nabla\cdot(A\nabla u) - u\bigr) + k^{-2} \nabla\cdot( A\nabla\chi \, u ) + k^{-2} A\nabla\chi \cdot \nabla u \\
&= \chi \mathcal{L}u + k^{-2} \nabla\cdot( A\nabla\chi \, u ) + k^{-2} A\nabla\chi \cdot \nabla u.
\end{aligned}
$$

将 $\mathcal{L}u = f$ 代入，得到最终展开式：

$$
\boxed{ f_1 = \mathcal{L}(\chi u) = \chi f + k^{-2} \nabla\cdot( A\nabla\chi \, u ) + k^{-2} A\nabla\chi \cdot \nabla u }. \tag{8}
$$

### 3.3 离散内估计的完成

回顾我们之前的变换：

$$
\bigl| a_{\Omega}(\Delta_h(\chi u), v) \bigr| = \bigl| (f_1, \Delta_{-h} v) \bigr|.
$$

取检验函数 $v = \Delta_h(\chi u)$，利用 Gårding 不等式 (5) 及上述恒等式：

$$
\begin{aligned}
\|\Delta_h(\chi u)\|_{L^2(\Omega)}^2
&\le \frac{1}{C_g} \Bigl( |a_{\Omega}(\Delta_h(\chi u), \Delta_h(\chi u))| + \|\Delta_h(\chi u)\|_{L^2(\Omega)}^2 \Bigr) \\
&= \frac{1}{C_g} \Bigl( |(f_1, \Delta_{-h}\Delta_h(\chi u))| + \|\Delta_h(\chi u)\|_{L^2(\Omega)}^2 \Bigr) \\
&\le \frac{1}{C_g} \Bigl( \|f_1\|_{L^2(\Omega)} \|\Delta_{-h}\Delta_h(\chi u)\|_{L^2} + \|\Delta_h(\chi u)\|_{L^2(\Omega)}^2 \Bigr). \tag{9}
\end{aligned}
$$

由 $f_1$ 的表达式 (8)，利用 $\chi \in C_c^\infty$ 且其各阶导数有界，以及 $A \in \operatorname{Lip}$：

$$
\|f_1\|_{L^2(\Omega)} \le C \bigl( \|f\|_{L^2(\Omega)} + \|u\|_{H^1(G_2)} \bigr). \tag{10}
$$

差分商 $\Delta_h$ 对 $H^1$ 范数的一致有界性（Nirenberg 引理）保证了

$$
\|\Delta_{-h}\Delta_h(\chi u)\|_{L^2} \le C \|\nabla^2 u\| \quad \text{以及} \quad
\|\Delta_h(\chi u)\|_{L^2} \le C \|\nabla u\|_{L^2}.
$$

将这些代入 (9) 并关于 $h$ 取极限 $h \to 0^+$（利用弱紧性：差分商弱收敛于弱导数），最终得到

$$
\|D^2 u\|_{L^2(G_1)} \le C \bigl( \|u\|_{H^1(\Omega)} + \|f\|_{L^2(\Omega)} \bigr). \tag{11}
$$

由于 $G_1$ 是 $\Omega$ 的任意紧子集，通过单位分解及边界拉平技术（利用 $\partial\Omega \in C^{1,1}$ 的条件），可以将内部估计提升为全局 $H^2$ 估计 (3)。

## 4. 主要结论

:::theorem[$H^2$ 正则性]

设 $\Omega \subset \mathbb{R}^d$ 为有界区域且 $\partial\Omega \in C^{1,1}$。设 $A = (a^{ij})$ 一致椭圆且 $a^{ij} \in \operatorname{Lip}(\overline\Omega)$。若 $u \in H^1(\Omega)$ 是方程 $\mathcal{L}u = f$（即 (2)）的弱解，其中 $f \in L^2(\Omega)$，则 $u \in H^2(\Omega)$ 且满足估计

$$
\|u\|_{H^2(\Omega)} \le C \bigl( \|u\|_{H^1(\Omega)} + \|f\|_{L^2(\Omega)} \bigr),
$$

其中 $C = C(\Omega, \lambda, \Lambda, \|\nabla A\|_{L^\infty}, k)$。

:::

:::remark

该估计对 Helmholtz 方程（$k$ 为波数）尤为重要：加权 $H^2$ 范数中的权重 $k^{-|\alpha|}$ 与方程两边同除 $k^2$ 后的缩放一致——在此缩放下，算子主部的自然能量对应的是 $k^{-1}\nabla$ 而非 $\nabla$，因此二阶导数贡献被 $k^{-2}$ 压低而非放大。PML 截断在引入复系数后，只要 Gårding 不等式依然成立，上述论证同样适用。

:::
