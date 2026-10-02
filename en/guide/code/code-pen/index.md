---
url: /en/guide/code/code-pen/index.md
---
The theme supports embedding [CodePen](https://codepen.io/) in Markdown files.

## Configuration

This feature is disabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codepen: true, // [!code highlight]
    },
  })
})
```

## Syntax

Basic syntax:

```md
@[codepen](user/slash)
```

Extended options support:

```md
@[codepen preview editable tab="css,result" theme="dark" height="500px" width="100%"](user/slash)
```

* `preview`: Whether to render in preview mode
* `editable`: Whether the content is editable
* `tab`: Default active tabs, defaults to `result`, multiple tabs separated by `,`
* `theme`: Theme, options: `dark` and `light`
* `height`: Container height, defaults to `400px`
* `width`: Container width, defaults to `100%`
* `user`: CodePen username
* `slash`: CodePen pen slug/identifier

## Examples

Input:

```md
@[codepen](leimapapa/RwOZQOW)
```

Output:

@[codepen](leimapapa/RwOZQOW)

**Preview Mode:**

Input:

```md
@[codepen preview](leimapapa/RwOZQOW)
```

Output:

@[codepen preview](leimapapa/RwOZQOW)

**Editable Mode:**

Input:

```md
@[codepen editable tab="html,result"](leimapapa/RwOZQOW)
```

Output:

@[codepen editable tab="html,result"](leimapapa/RwOZQOW)
