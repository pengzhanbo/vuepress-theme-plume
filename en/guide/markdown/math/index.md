---
url: /en/guide/markdown/math/index.md
---
## Overview

The theme has built-in support for mathematical formulas.

This feature is powered by [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html).
You can choose to render mathematical formulas in markdown using the following methods:

* `katex` (default)
* `mathjax`

## Usage

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      math: {
        type: 'katex', // 'katex' | 'mathjax'
        // ... Other configuration options
      }
    },
  })
})
```

When you choose to use `mathjax`, you also need to install the dependency by running the following command:

::: npm-to

```sh
npm i @mathjax/src
```

:::

## Syntax

### Inline Syntax

Use `$` to wrap mathematical formulas *(i.e., write the mathematical formula between two `$` symbols)*

::: demo markdown title="Inline Mode" expanded

```md
Euler's identity $e^{i\pi}+1=0$ is a beautiful formula in $\mathbb{R}^2$.
```

:::

### Block Syntax

Use `$$` to wrap mathematical formulas *(i.e., write the mathematical formula between two `$$` symbols)*

```md /$$/
<!-- Write the mathematical formula between two `$$` symbols, rendered in a separate block -->
$$xxx$$

<!-- The two `$$` symbols can each occupy a separate line, with the mathematical formula between them -->
$$
xxx
$$
```

:::demo markdown title="Block Mode" expanded

```md
$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}
$$
```

:::

## Related Tutorials

### TeX

[TeX Tutorial](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes){.readmore}
[TeX Cheat Sheet](https://mdit-plugins.github.io/zh/tex.html#tex-tutorial){.readmore}

### KaTeX

[KaTeX Supported Features](https://katex.org/docs/supported.html){.readmore}
[KaTeX Support Table](https://katex.org/docs/support_table.html){.readmore}

### MathJax

[Supported TeX / KaTeX Commands](https://docs.mathjax.org/en/latest/input/tex/macros/index.html#tex-commands){.readmore}

## Configuration Options

:::: field-group
::: field name="type" type="'katex' | 'mathjax'" default="'katex'"

Package used to render $\TeX$ content.

* `'katex'`: Use [KaTeX](https://katex.org/)
* `'mathjax'`: Use [MathJax](https://www.mathjax.org/)
  :::
  :::field name="delimiters" type="'brackets' | 'dollars' | 'all'" default="'dollars'" optional
  Enabled math delimiter syntax.
  * `"brackets"`: Use `\(...\)` for inline math and `\[...\]` for display mode math (LaTeX style)
  * `"dollars"`: Use `$...$` for inline math and `$$...$$` for display mode math (common Markdown style)
  * `"all"`: Enable both bracket and dollar sign syntax
    :::
    ::::

### Using KaTeX

When using KaTeX, any other options will be passed to KaTeX as `KatexOptions`. For all available options, refer to the [KaTeX documentation](https://katex.org/docs/options.html).

Additionally, 2 special options are supported:

:::: field-group
::: field name="copy" type="boolean" optional default="false"
Whether to enable the copy extension.
:::
::: field name="mhchem" type="boolean" optional default="false"
Whether to enable the mhchem extension.
:::
::::

### Using MathJax

When using MathJax, you can set:

:::: field-group
:::field name="tex" type="object" optional
Options passed to the TeX input parser.
:::
::: field name="output" type="'svg' | 'chtml'" default="'svg'" optional
Output format, either SVG or Common HTML.
:::
::: field name="chtml" type="object" optional
Options passed to the Common HTML output parser.
:::
::: field name="svg" type="object" optional
Options passed to the SVG output parser.
:::
::::
