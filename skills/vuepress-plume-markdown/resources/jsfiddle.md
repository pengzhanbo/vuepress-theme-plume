# JSFiddle

## Enable

```ts
markdown: { jsfiddle: true }
```

## Syntax

```md
@[jsfiddle](user/id)
@[jsfiddle theme="dark" tab="js,css,html,result" height="500px"](user/id)
```

The path is `jsfiddle.net/<user>/<id>` → `user/id`.

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `theme` | `'light' \| 'dark'` | `light` | embed theme |
| `tab` | `string` | `js,css,html,result` | visible tabs, comma separated; the **order** defines the tab order |
| `height` | `string` | `500px` | iframe height |

## Examples

```md
@[jsfiddle](pengzhanbo/1xbwz2p9)

@[jsfiddle tab="result,js,css,html" theme="dark"](pengzhanbo/1xbwz2p9)
```
