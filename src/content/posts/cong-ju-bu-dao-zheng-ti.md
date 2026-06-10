---
title: "椭圆问题的正则性估计（二）：从局部到整体"
date: 2026-06-10
tags: ["数学", "偏微分方程", "椭圆方程"]
description: "利用单位分解（partition of unity）将局部正则性估计拼合为全局 H² 估计"
---

## 1. 思路概述

要得到整体上的 $H^2$ 正则性估计，可以从两部分入手：**内部正则性**和**边界正则性**。将两者叠加即得全局估计。

实现这一叠加的标准手段是**单位分解**（partition of unity）。思路如下：将偏微分方程的解分解为各个局部区域上支集的 $u_j$，即令

$$
\{ \chi_j \} \subset C_c^\infty(\Omega),\qquad \operatorname{supp} \chi_j = \Omega_j,\qquad \sum_j \chi_j = 1 \ \text{ on } \Omega,
$$

则 $u = \sum_j \chi_j u$。记 $u_j := \chi_j u$，每一 $u_j$ 支集在 $\Omega_j$ 内。

## 2. 局部方程的推导

设方程形如 $L u = f$（例如 $L = -\nabla\cdot(A\nabla \cdot) + k^2$）。作用 $\chi_j$ 于方程：

$$
\chi_j L u + [L, \chi_j] u = \chi_j f,
$$

其中 $[L, \chi_j] = L\chi_j - \chi_j L$ 为交换子。令 $f_j := \chi_j f + [L, \chi_j] u$，则局部方程为

$$
L u_j = f_j \quad \text{in } \Omega_j.
$$

关键在于：交换子 $[L, \chi_j]$ 仅涉及 $u$ 的一阶导数（因为 $L$ 是二阶算子，$\chi_j$ 是 $C^\infty$ 截断，交换后降阶），因此 $f_j \in L^2(\Omega_j)$ 可由 $f$ 和 $u$ 的一阶导数控制。

## 3. 局部估计

取子区域 $\Omega_j' \subset\subset \Omega_j$，使得 $\chi_j \equiv 1$ 在 $\Omega_j'$ 上，且

$$
\bigcup_j \overline{\Omega_j'} = \overline{\Omega}.
$$

在每个 $\Omega_j'$ 上，由椭圆方程的局部 $H^2$ 正则性估计（例如通过差分商法或 Fourier 乘子法）：

$$
\|u\|_{H^2(\Omega_j')} \le C \bigl( \|u_j\|_{L^2(\Omega_j)} + \|f_j\|_{L^2(\Omega_j)} \bigr).
$$

将 $f_j$ 的表达式代入：

$$
\|u\|_{H^2(\Omega_j')} \le C \bigl( \|u\|_{L^2(\Omega_j)} + \|f\|_{L^2(\Omega_j)} + \|\nabla u\|_{L^2(\Omega_j)} \bigr).
$$

## 4. 全局估计的合成

对所有 $j$ 求和，利用 $\bigcup \overline{\Omega_j'} = \overline{\Omega}$：

$$
\begin{aligned}
\|u\|_{H^2(\Omega)}^2 &= \sum_j \|u\|_{H^2(\Omega_j'\cap\Omega)}^2 \\
&\le C \sum_j \bigl( \|u\|_{L^2(\Omega_j)}^2 + \|f\|_{L^2(\Omega_j)}^2 + \|\nabla u\|_{L^2(\Omega_j)}^2 \bigr) \\
&\le C M \bigl( \|u\|_{L^2(\Omega)}^2 + \|f\|_{L^2(\Omega)}^2 + \|\nabla u\|_{L^2(\Omega)}^2 \bigr),
\end{aligned}
$$

其中 $M$ 是覆盖数（每个点被有限个 $\Omega_j$ 覆盖，由单位分解的局部有限性保证）。再由 Poincaré 不等式或椭圆方程的 $H^1$ 先验估计消去 $\|\nabla u\|_{L^2}$ 项，最终得到

$$
\boxed{ \|u\|_{H^2(\Omega)} \le C \bigl( \|u\|_{L^2(\Omega)} + \|f\|_{L^2(\Omega)} \bigr) }.
$$

:::theorem[全局 $H^2$ 正则性]
设 $\Omega \subset \mathbb{R}^d$ 为有界区域且 $\partial\Omega \in C^{1,1}$，$L$ 为一致椭圆二阶算子（系数 Lipschitz 连续）。若 $u \in H^1(\Omega)$ 满足 $L u = f \in L^2(\Omega)$，则 $u \in H^2(\Omega)$ 且上述估计成立。
:::

## 5. 与差分商方法的关系

两种方法各有侧重：

- **差分商法**（Nirenberg 平移法）：直接从弱形式出发，通过差分商逼近导数，利用 Gårding 不等式和交换子估计建立 $H^2$ 界。技术性强，但不依赖于单位分解和局部-整体拼合的结构。
- **单位分解法**：将正则性分解为内部估计 + 边界估计两个独立模块，然后用单位分解拼合。结构清晰，适合复杂边界条件和非光滑区域。同样需要椭圆方程的局部 $H^2$ 估计作为输入。

两种路径最终给出相同的结论，且在 Lipschitz 系数 + $C^{1,1}$ 边界的条件下，两个框架可以互相验证。实际应用中常混合使用：内部用差分商估计，边界用拉平技术 + 单位分解。

:::remark
这里的论述假定已经具备了**内部正则性**和**边界正则性**的局部估计。所谓"局部到整体"实际上是一个**组合框架**（assembly framework），其核心思想是：

1. 用单位分解将全局问题拆分为局部问题；
2. 在每个局部上调用已建立的正则性估计；
3. 利用覆盖的有限重叠性汇总估计。

这一框架适用于各种椭圆型方程及系统，不限于标量方程。
:::
