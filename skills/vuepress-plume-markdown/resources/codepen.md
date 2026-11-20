# CodePen

## Enable

```ts
markdown: { codepen: true }
```

## Syntax

```md
@[codepen](user/slash)
```

The path is `codepen.io/<user>/pen/<slash>` → `user/slash` (it is **not** just the pen id).

## Props (key=value, before the parentheses)

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `preview` | `boolean` | `false` | 30% code / 70% preview layout |
| `editable` | `boolean` | `false` | allow editing inside the embed |
| `tab` | `string` | `result` | `html`, `css`, `js`, `result` — comma separated |
| `theme` | `'dark' \| 'light'` | `dark` | embed theme |
| `height` | `string` | `400px` | iframe height |
| `width` | `string` | `100%` | iframe width |

## Examples

```md
@[codepen](leimapapa/RwOZQOW)

@[codepen preview](leimapapa/RwOZQOW)

@[codepen editable tab="css,result" theme="dark" height="500px" width="100%"](user/slash)
```
