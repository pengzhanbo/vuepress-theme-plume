# AcFun Video

Embed AcFun videos in your markdown.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      acfun: true,
    },
  })
})
```

## Syntax

```md
@[acfun](id)
```

With options:

```md
@[acfun width="100%" height="400px" ratio="16:9"](id)
```

**Parameters:**

- `id`: Video ID
- `width`: Video width
- `height`: Video height
- `ratio`: Video aspect ratio (default `16:9`)

## Example

```md
@[acfun](ac47431669)
```
