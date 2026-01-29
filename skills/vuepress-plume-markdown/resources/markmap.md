# Markmap

The theme supports embedding [markmap](https://markmap.js.org/) mind maps within articles.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      markmap: true,
    },
  })
})
```

You also need to install `markmap-lib`, `markmap-toolbar`, and `markmap-view`:

```sh
npm i markmap-lib markmap-toolbar markmap-view
```

## Syntax

Use the `markmap` code block. Frontmatter configuration is supported within the block.

````md
```markmap
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
```
````
