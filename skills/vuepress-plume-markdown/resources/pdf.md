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
@[pdf page="2" width="100%" height="400px" ratio="16:9"](url)
```

**Parameters:**

- `url`: PDF URL
- `page`: Page number (default `1`). The shorthand `@[pdf 2](url)` is also supported
- `width`: Width (default `100%`)
- `height`: Height (default `auto`)
- `ratio`: Aspect ratio (default `1:0.9`, only effective when height is not set)

## Example

```md
@[pdf page="2"](https://plume.pengzhanbo.cn/files/sample.pdf)
```
