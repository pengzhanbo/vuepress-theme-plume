# QR Code

## Enable

```ts
markdown: { qrcode: true }
```

## Syntax

```md
@[qrcode](text)
@[qrcode width="150px" logo="/images/logo.png" align="center"](text)
```

Container form (same props, content is the encoded text):

```md
:::: qrcode card title="扫码访问" align="center"
https://example.com
::::
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `card` | `boolean` | `false` (wrap in a card) |
| `title` | `string` | — (with `card`) |
| `align` | `'left' \| 'center' \| 'right'` | `left` |
| `width` | `string` | `128px` (`150px` on ≥ 768px) |
| `logo` | `string` | — (absolute path only) |
| `logo-size` / `logoSize` | `number` | `0.2` |
| `light` | `string` | `#ffffffff` |
| `dark` | `string` | `#000000ff` |
| `margin` | `number` | `2` |
| `level` | `'L' \| 'M' \| 'Q' \| 'H'` | `M` (`H` with logo) |
| `scale` | `number` | `4` |
| `version` | `number` | auto |
| `mask` | `number` | — |

There is **no** `svg` prop.

## Site-internal text

When the text is an internal markdown path (`.md`, relative or site-absolute), the plugin encodes the rendered
page URL and adds the site logo automatically:

```md
@[qrcode](/guide/intro.md)
```

## Examples

```md
@[qrcode card align="center"](https://theme-plume.vuejs.press/)

:::: qrcode card title="扫码查看文档" logo="/images/logo.png" logo-size="0.25"
https://theme-plume.vuejs.press/
::::
```
