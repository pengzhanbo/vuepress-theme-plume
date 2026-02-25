---
url: /guide/markdown/math/index.md
---
## 概述

主题内置了对 数学公式 的支持。

该功能由 [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html) 提供支持。你可以选择在 markdown 中使用以下方式渲染数学公式:

* `katex` (默认)
* `mathjax`

## 使用

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      math: {
        type: 'katex', // 'katex' | 'mathjax'
        // ... 其它配置项
      }
    },
  })
})
```

当你选择使用 `mathjax` 时，还需要执行以下命令安装依赖：

::: npm-to

```sh
npm i @mathjax/src
```

:::

## 语法

### 内联语法

使用 `$` 包裹数学公式 *（即在两个 `$` 之间编写数学公式）*

::: demo markdown title="内联模式" expanded

```md
Euler's identity $e^{i\pi}+1=0$ is a beautiful formula in $\mathbb{R}^2$.
```

:::

### 块级语法

使用 `$$` 包裹数学公式 *（即在两个 `$$` 之间编写数学公式）*

```md /$$/
<!-- 在两个 `$$` 之间编写数学公式，在单独的块中渲染 -->
$$xxx$$

<!-- 两个 `$$` 可以单独占一行，数学公式在它们之间 -->
$$
xxx
$$
```

:::demo markdown title="块级模式" expanded

```md
$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}
$$
```

:::

## 相关教程

### TeX

[TeX 教程](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes){.readmore}
[TeX 速查表](https://mdit-plugins.github.io/zh/tex.html#tex-tutorial){.readmore}

### KateX

[KateX 支持功能](https://katex.org/docs/supported.html){.readmore}
[KateX 支持列表](https://katex.org/docs/support_table.html){.readmore}

### Mathjax

[支持的 TeX / KateX 命令](https://docs.mathjax.org/en/latest/input/tex/macros/index.html#tex-commands){.readmore}

## 配置项

:::: field-group
::: field name="type" type="'katex' | 'mathjax'" default="'katex'"

用于渲染 $\TeX$ 内容的包。

* `'katex'`：使用 [KaTeX](https://katex.org/)
* `'mathjax'`：使用 [MathJax](https://www.mathjax.org/)
  :::
  :::field name="delimiters" type="'brackets' | 'dollars' | 'all'" default="'dollars'" optional
  启用的数学分隔符语法。
  * `"brackets"`: 使用 `\(...\)` 表示内联数学，使用 `\[...\]` 表示显示模式数学（LaTeX 风格）
  * `"dollars"`: 使用 `$...$` 表示内联数学，使用 `$$...$$` 表示显示模式数学（常见 Markdown 风格）
  * `"all"`: 启用括号和美元符号两种语法
    :::
    ::::

### 使用 KaTeX

使用 KaTeX 时，任何其他选项都将作为 `KatexOptions` 传递给 KaTeX。有关所有可用选项，请参阅 [KaTeX 文档](https://katex.org/docs/options.html)。

此外，还支持 2 个特殊选项：

:::: field-group
::: field name="copy" type="boolean" optional default="false"
是否启用复制扩展。
:::
::: field name="mhchem" type="boolean" optional default="false"
是否启用 mhchem 扩展。
:::
::::

### 使用 MathJax

使用 MathJax 时，你可以设置：

:::: field-group
:::field name="tex" type="object" optional
传递给 TeX 输入解析器的选项。
:::
::: field name="output" type="'svg' | 'chtml'" default="'svg'" optional
输出格式，SVG 或通用 HTML。
:::
::: field name="chtml" type="object" optional
传递给通用 HTML 输出解析器的选项。
:::
::: field name="svg" type="object" optional
传递给 SVG 输出解析器的选项。
:::
::::
