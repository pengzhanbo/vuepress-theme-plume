# PDF

## Enable

```ts
markdown: {
  pdf: true,
  // or point at a self-hosted PDF.js
  pdf: { pdfjsUrl: '/pdfjs/' }, // default https://static.pengzhanbo.cn/pdfjs/
}
```

## Syntax

```md
@[pdf](url)
@[pdf page="2" width="100%" ratio="16:9"](url)
```

| Prop | Type | Default |
| --- | --- | --- |
| `page` | `number` | `1` |
| `width` | `string` | `100%` |
| `height` | `string` | auto |
| `ratio` | `string` | `16/9` (only when `height` is unset) |
| `zoom` | `number` | `50` (percent) |
| `no-toolbar` | `boolean` | `false` |

The legacy shorthand `@[pdf 2](url)` still works but prefer `page="2"`.

## Examples

```md
@[pdf page="2"](https://example.com/files/sample.pdf)

@[pdf page="1" height="600px" no-toolbar zoom="80"](https://example.com/files/sample.pdf)
```
