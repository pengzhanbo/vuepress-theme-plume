# PDF Reader

Embed PDF files directly in your markdown.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: true,
    },
  })
})
```

## Syntax

Simple syntax:

```md
@[pdf](url)
```

With options:

```md
@[pdf 2 no-toolbar width="100%" height="400px" ratio="16:9" zoom="100"](url)
```

**Parameters:**

- `url`: PDF URL
- `page`: Page number (e.g., `2` in `@[pdf 2]`)
- `no-toolbar`: Hide the toolbar
- `width`: Width (default `100%`)
- `height`: Height (default `auto`)
- `ratio`: Aspect ratio (default `16:9` if height not set)
- `zoom`: Zoom level percentage

## Example

```md
@[pdf 2 no-toolbar](https://plume.pengzhanbo.cn/files/sample.pdf)
```
