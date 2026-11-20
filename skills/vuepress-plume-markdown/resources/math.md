# Math

Enabled by default with KaTeX.

```md
行内公式：$E = mc^2$

块级公式：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

Also supported while `delimiters` includes `brackets`: `\( ... \)` and `\[ ... \]`.

## Config

```ts
markdown: {
  math: { type: 'katex' }, // default; use { type: 'mathjax' } for MathJax
  math: {
    type: 'katex',
    delimiters: 'dollars', // 'dollars' (default) | 'brackets' (only \( \) \[\]) | 'all'
    katexOptions: { copy: false, mhchem: false }, // copy button on formulas, mhchem chemistry syntax
  },
  math: { type: 'mathjax', output: 'svg' }, // 'svg' (default) | 'chtml'
}
```

Set `math: false` to disable. MathJax requires the optional peer `@mathjax/src`.

## Notes

- Inside code blocks and inline code, `$` is not parsed.
- Escape a literal dollar sign as `\$`.
- KaTeX renders at build time, so unsupported commands surface as build warnings.
