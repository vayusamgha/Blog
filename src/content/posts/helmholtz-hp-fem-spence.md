---
title: "Helmholtz hp-有限元方法的误差估计——Spence 论文阅读笔记"
date: 2026-06-11
tags: ["数学", "偏微分方程", "有限元", "Helmholtz方程"]
description: "关于 Helmholtz 方程 hp-有限元方法误差分析的阅读笔记，涵盖函数空间设置、双线性形式的连续性与 Gårding 不等式、正则性假设及对偶论证。"
draft: false
---

## 1. 引言

本文梳理关于 Helmholtz 方程 hp-有限元方法（hp-FEM）误差估计的阅读笔记。非强制的（non-coercive）双线性形式是 Helmholtz 问题有限元分析的核心困难之一。这里的论证框架是标准的 Schatz 型论证（Schatz, 1974），结合 hp-FEM 的逼近性质，可推广至变波数（wavenumber-explicit）估计。

---

## 2. 函数空间与双线性形式

设 $\Omega \subset \mathbb{R}^d$ 为有界区域。记

$$
H^1 \subset L^2 \subset H^{-1},
$$

且 $H^1 \overset{\text{紧凑}}{\hookrightarrow} L^2$（Rellich--Kondrachov 紧嵌入定理）。

双线性形式 $a(\cdot,\cdot): H^1 \times H^1 \to \mathbb{C}$ 满足以下两个性质：

:::theorem[性质 1（连续性 & Gårding 不等式）]
存在常数 $C, C_1, C_2 > 0$ 使得

（i）**连续性**：
$$
|a(u,v)| \le C\, \|u\|_{H^1} \|v\|_{H^1}, \qquad \forall u,v \in H^1. \tag{1}
$$

（ii）**Gårding 不等式**：
$$
\operatorname{Re} a(u,u) \ge C_1 \|u\|_{H^1}^2 - C_2 \|u\|_{L^2}^2, \qquad \forall u \in H^1. \tag{2}
$$
:::

Gårding 不等式说明 $a$ 不是强制的（coercive），但偏离强制性的部分至多是一个 $L^2$ 项。这一结构是后续分裂论证的出发点。

---

## 3. 正则性假设

为了在有限元分析中使用 Aubin--Nitsche 对偶技巧，需要对伴随问题具有 $H^2$ 正则性。

:::theorem[正则性假设]
存在常数 $C_{\mathrm{ell}} > 0$ 使得对满足右端有限的 $u$，有

$$
\|u\|_{H^2} \le C_{\mathrm{ell}} \left( \|u\|_{L^2} + \sup_{v \in H^1} \frac{|a(u,v)|}{\|v\|_{L^2}} \right), \tag{3}
$$

以及

$$
\|u\|_{H^2} \le C_{\mathrm{ell}} \left( \|u\|_{L^2} + \sup_{v \in H^1} \frac{|\operatorname{Re} a(u,v)|}{\|v\|_{L^2}} \right). \tag{4}
$$
:::

若 $u$ 是原问题 $a(u,v) = \langle f, v \rangle$ 的解（$f \in L^2$），则正则性假设 (3)--(4) 推出标准的 $H^2$ 正则性

$$
\|u\|_{H^2} \le C \|f\|_{L^2},
$$

即解算子 $f \mapsto u$ 是 $H^{-1} \to H^1$（进而 $H^{-1} \to H^2$）的有界算子。

### 3.1 对偶问题与解算子 $R^*$

考虑伴随问题：求 $w \in H^1$ 满足

$$
a(v, w) = \langle v, f \rangle, \qquad \forall v \in H^1. \tag{5}
$$

若问题 (5) 可解，定义解算子 $R^*: H^{-1} \to H^1$ 满足 $R^*f = w$。由正则性假设，$R^*$ 实为 $H^{-1} \to H^2$ 的有界算子。特别地，

$$
R^*: L^2 \to L^2 \quad \text{是紧算子（因 $H^2 \subset \!\subset L^2$）}.
$$

---

## 4. 强制性分裂

Gårding 不等式暗示我们可以将双线性形式分裂为一个强制部分与一个紧扰动之和。

:::lemma[强制性分裂]
存在有界自伴算子 $S: L^2 \to L^2$ 使得分裂后的双线性形式

$$
\tilde a(u,v) := a(u,v) + \langle Su, v \rangle_{L^2} \tag{6}
$$

在 $H^1$ 上是强制的（coercive），即存在 $\alpha > 0$ 使得

$$
\operatorname{Re} \tilde a(u,u) \ge \alpha \|u\|_{H^1}^2, \qquad \forall u \in H^1. \tag{7}
$$
:::

*证*：由 Gårding 不等式 (2)，取 $S = C_2 I$（$C_2$ 即不等式中的 $L^2$ 系数），则

$$
\operatorname{Re} \tilde a(u,u) = \operatorname{Re} a(u,u) + C_2 \|u\|_{L^2}^2 \ge C_1 \|u\|_{H^1}^2.
$$

即 $\tilde a$ 强制。在实际构造中，$S$ 可以取更一般的形式（如与边界条件相关的算子），但核心思想相同。

---

## 5. 投影算子与最佳逼近

设 $V_h \subset H^1$ 为 hp-有限元空间。定义以下投影算子：

- $\tilde T_h: H^1 \to V_h$：对应于强制形式 $\tilde a(\cdot,\cdot)$ 的 Galerkin 投影，即
  $$
  \tilde a(\tilde T_h u, v_h) = \tilde a(u, v_h), \qquad \forall v_h \in V_h.
  $$

由 Lax--Milgram 引理（$\tilde a$ 强制），$\tilde T_h$ 是良好定义的。

记 $\eta = \eta(h,p)$ 为 hp-有限元的逼近率（依赖于单元尺寸 $h$ 和多项式次数 $p$）。对 $w \in H^2$ 有

$$
\|w - \tilde T_h w\|_{H^1} \le C \eta \, \|w\|_{H^2}, \tag{8}
$$
$$
\|w - \tilde T_h w\|_{L^2} \le C \eta \, \|w - \tilde T_h w\|_{H^1} \le C \eta^2 \|w\|_{H^2}. \tag{9}
$$

---

## 6. 误差分析

设 $u \in H^1$ 为精确解，$u_h \in V_h$ 为 Galerkin 有限元解：

$$
a(u_h, v_h) = \langle f, v_h \rangle, \qquad \forall v_h \in V_h.
$$

记误差 $e = u - u_h$。由 Galerkin 正交性

$$
a(e, v_h) = 0, \qquad \forall v_h \in V_h. \tag{10}
$$

### 6.1 $L^2$ 误差估计

:::theorem[$L^2$ 误差估计]
在正则性假设与分裂引理的条件下，存在与 $h,p$ 无关的常数 $C > 0$ 使得

$$
\|e\|_{L^2} \le C \eta \, \|e\|_{H^1}. \tag{11}
$$

*证*：考虑对偶问题 $a(v,w) = (e, v)_{L^2}$，其解由 $R^*$ 给出：$w = R^* e$。由 (3)--(4) 的正则性假设，

$$
\|w\|_{H^2} \le C \|e\|_{L^2}. \tag{12}
$$

由对偶性（取 $v = e$ 代入对偶问题）立即得到

$$
\|e\|_{L^2}^2 = a(e, w). \tag{13}
$$

令 $w_h = \tilde T_h w$。由 (10) 有 $a(e, w_h) = 0$，故

$$
\|e\|_{L^2}^2 = a(e, w - w_h). \tag{14}
$$

将 $a$ 分裂为 $\tilde a - \langle S\cdot,\cdot\rangle$：

$$
a(e, w - w_h) = \tilde a(e, w - w_h) - \langle Se, w - w_h\rangle. \tag{15}
$$

由 (7) 的强制性、$a$ 的连续性及 $S$ 的有界性：

$$
\begin{aligned}
\|e\|_{L^2}^2 &\le C \|e\|_{H^1} \|w - w_h\|_{H^1} + C \|e\|_{L^2} \|w - w_h\|_{L^2}.
\end{aligned}
$$

代入逼近性质 (8)--(9) 及正则性 (12)：

$$
\begin{aligned}
\|e\|_{L^2}^2 &\le C \eta \, \|e\|_{H^1} \|w\|_{H^2} + C \eta^2 \|e\|_{L^2} \|w\|_{H^2} \\
&\le C \eta \, \|e\|_{H^1} \|e\|_{L^2} + C \eta^2 \|e\|_{L^2}^2.
\end{aligned} \tag{16}
$$

当 $\eta$ 充分小时（即网格足够精细），右端第二项可被左端吸收，得到 (11)。证毕。
:::

### 6.2 $H^1$ 误差估计

现在建立 $H^1$ 误差的拟最优性。

:::theorem[$H^1$ 误差估计]
在相同假设下，存在常数 $C > 0$ 使得

$$
\|e\|_{H^1} \le C \inf_{v_h \in V_h} \|u - v_h\|_{H^1}. \tag{17}
$$

*证*：对任意 $v_h \in V_h$，由 Galerkin 正交性 (10) 有 $a(e, v_h) = 0$，因此

$$
a(e, e) = a(e, e - v_h). \tag{18}
$$

应用 Gårding 不等式 (2) 与连续性 (1)：

$$
C_1 \|e\|_{H^1}^2 - C_2 \|e\|_{L^2}^2 \le \operatorname{Re} a(e,e) = \operatorname{Re} a(e, e - v_h) \le C \|e\|_{H^1} \|e - v_h\|_{H^1}. \tag{19}
$$

利用 Young 不等式 $ab \le \frac{\varepsilon}{2} a^2 + \frac{1}{2\varepsilon} b^2$，取 $\varepsilon = C_1 / C$：

$$
C \|e\|_{H^1} \|e - v_h\|_{H^1} \le \frac{C_1}{2} \|e\|_{H^1}^2 + \frac{C^2}{2C_1} \|e - v_h\|_{H^1}^2.
$$

代入 (19) 并整理：

$$
\frac{C_1}{2} \|e\|_{H^1}^2 \le \frac{C^2}{2C_1} \|e - v_h\|_{H^1}^2 + C_2 \|e\|_{L^2}^2.
$$

对 $v_h \in V_h$ 取下确界，并利用 $L^2$ 估计 (11)：

$$
\|e\|_{H^1}^2 \le C \inf_{v_h \in V_h} \|u - v_h\|_{H^1}^2 + C \eta^2 \|e\|_{H^1}^2.
$$

当 $\eta$ 充分小时吸收右端第二项，即得 (17)。证毕。
:::

### 6.3 $L^2$ 估计的最终形式

将 (17) 代入 (11) 即得 $L^2$ 误差的显式估计：

$$
\|u - u_h\|_{L^2} \le C \eta \inf_{v_h \in V_h} \|u - v_h\|_{H^1}. \tag{20}
$$

### 6.4 $S$ 项的对偶处理

在上述 $L^2$ 证明中，对 $S$ 项我们采用了直接的有界性 $\langle Se, w - w_h\rangle \le \|Se\|_{L^2} \|w - w_h\|_{L^2}$。原笔记中还给出了另一种思路：利用第二轮对偶论证估计 $\|S(I - \tilde T_h)w\|_{L^2}$。

令 $w = R^* e$。考虑

$$
\|S(I - \tilde T_h) w\|_{L^2}^2 = \langle S S (I - \tilde T_h) w,\; (I - \tilde T_h) w \rangle. \tag{21}
$$

设 $z = R^*\bigl(S S (I - \tilde T_h) w\bigr)$，即 $z$ 满足 $a(v,z) = \langle S S (I - \tilde T_h) w,\; v \rangle$。则 (21) 化为

$$
= a(z,\; (I - \tilde T_h) w). \tag{22}
$$

取 $z_h \in V_h$ 为 $z$ 的 Galerkin 投影，由正交性 $a(z - z_h,\; (I - \tilde T_h) w)$，再由连续性与逼近性质得到

$$
\|S(I - \tilde T_h) w\|_{L^2} \le C \eta^2 \|S(I - \tilde T_h) w\|_{L^2} \|w\|_{H^2},
$$

从而在精细网格上消去左端后可得更精细的 $S$ 项估计。

---

## 7. 总结

本文梳理了 Helmholtz 方程 hp-有限元误差分析框架中的几个关键工具：

1. **函数空间嵌入**：$H^1 \subset L^2 \subset H^{-1}$，紧嵌入 $H^1 \hookrightarrow L^2$ 是将 Gårding 不等式转化为强制性分裂的必要条件。
2. **双线性形式的性质**：连续性与 Gårding 不等式是椭圆型问题的标准结构。
3. **正则性假设**：为 Aubin--Nitsche 对偶论证提供了 $H^2$ 正则性保证，使 $L^2$ 误差比 $H^1$ 误差高一阶。
4. **强制性分裂**：通过算子 $S$ 将非强制形式 $\tilde a$ 化为强制形式 + 紧扰动，从而可以应用 Lax--Milgram 引理与拟最优性分析。
5. **对偶论证**：Schatz 型论证 + 两次高移除次，最终将误差归结为有限元空间的最佳逼近问题。

核心结论：误差由 $\eta(h,p)$——即有限元空间对 $H^2$ 函数的逼近能力——所控制，而 $L^2$ 误差比 $H^1$ 误差额外多一阶 $\eta$ 的衰减。
