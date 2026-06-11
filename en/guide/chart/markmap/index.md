---
url: /en/guide/chart/markmap/index.md
---
## Overview

The theme supports embedding [markmap](https://markmap.js.org/) mind maps within articles.

This feature is powered by [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/).

## Configuration

This feature is disabled by default in the theme.

You need to install `markmap-lib`, `markmap-toolbar` and `markmap-view` in your project:

::: npm-to

```sh
npm i markmap-lib markmap-toolbar markmap-view
```

:::

Then, enable the feature in the `.vuepress/config.ts` configuration file:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      markmap: true, // [!code ++]
    },
  })
})
```

::: note
The following documentation is forked from [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/markmap.html),
licensed under [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE).
:::

## Syntax

````md
```markmap
<!-- Place content here -->
```
````

Configuration via Frontmatter syntax is supported.

## Example

::: demo markdown title="markmap"

`````md
````markmap
---
markmap:
  colorFreezeLevel: 2
---

# markmap

## Links

- <https://markmap.js.org/>
- [GitHub](https://github.com/markmap/markmap)

## Features

- Links
- **Strong** ~~Strikethrough~~ *Italic* ==Highlight==
- Multi-line
  text
- `Inline code`
-
    ```js
    console.log('code block');
    ```
- Katex
  - $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$
- Now we can wrap very very very very very very very very very very long text automatically with `maxWidth` option
````
`````

:::
