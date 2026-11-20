# Code Blocks

Highlighting is provided by `@vuepress/plugin-shiki` through `theme.codeHighlighter` (enabled by default,
default themes `vitesse-light` / `vitesse-dark`).

````markdown
```ts title="file.ts" :line-numbers :collapsed-lines=10 {2,4-6}
code
```
````

`title=`, `:flags` and `{lines}` may appear in any order after the language.

## Fence metadata

| Metadata | Effect |
| --- | --- |
| `title="a.ts"` | code block title bar |
| `:line-numbers` / `:no-line-numbers` | toggle line numbers (also `:line-numbers=2` to start at 2) |
| `{2,4-6}` | highlight lines |
| `:whitespace` / `:no-whitespace` | show spaces/tabs |
| `:collapsed-lines` / `:collapsed-lines=10` | collapse after N lines (default 15) |
| `:no-collapsed-lines` | disable collapsed lines for this block |

Global switches (`plumeTheme()` only):

```ts
codeHighlighter: {
  themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
  lineNumbers: true,
  whitespace: false,
  collapsedLines: false,
  twoslash: true,
  langs: ['ts', 'vue'],
  renderIndentGuides: true, // 缩进参考线（主题扩展）
  colorizedBrackets: true,  // 彩色括号（主题扩展）
}
```

## Notations (inside the code)

```ts
const a = 1   // [!code highlight]
const b = 2   // [!code focus]
const c = 3   // [!code focus:3]
const old = 1 // [!code --]
const newV = 1// [!code ++]
const w = 1   // [!code warning]
const e = 1   // [!code error]
// [!code word:config]
const config = {}
// [!code word:api:2]
```

Comment syntax per language:

| Language | Notation prefix |
| --- | --- |
| JS/TS/JSX/TSX, Go, Rust, C/C++ | `// [!code …]` |
| Python, Ruby, YAML, Bash/Shell | `# [!code …]` |
| CSS/SCSS/Less | `/* [!code …] */` |
| HTML/XML/Vue template | `<!-- [!code …] -->` |
| SQL | `-- [!code …]` |

Note: with `codeHighlighter.removeComments` the notation comments are stripped from output.

## Import code from a file

```md
@[code](../snippet/example.js)
@[code{1-10}](../snippet/example.js)
@[code js](../snippet/example.js)
@[code js{2,4-5}](../snippet/example.js)
@[code ts title="example.ts" :line-numbers](../snippet/example.ts)
```

Paths are relative to the current page (`../snippet/...`) and resolve against `sourceDir`.

## Twoslash

Enable `codeHighlighter: { twoslash: true }`, then add `twoslash` to the fence:

````md
```ts twoslash
const a = 1 // ^?
```
````

Object form passes compiler options: `twoslash: { compilerOptions: { paths: { '@/*': ['./src/*'] } } }`.

## Copy button

`copyCode` is enabled by default (`plugin-copy-code`); configure with
`copyCode: { showInMobile: false, ignoreSelector: ['.vp-copy-ignore'], inlineSelector: false }`.
Exclude a block by adding `.vp-copy-ignore` to its wrapper, or an inline snippet with `inlineSelector`.
