# CodeSandbox

## Enable

```ts
markdown: { codeSandbox: true } // camelCase config key
```

The embed syntax is all lowercase `@[codesandbox]`; writing `codesandbox` as the config key is silently ignored.

## Syntax

```md
@[codesandbox](id)
@[codesandbox button](workspace/id)
@[codesandbox title="标题" layout="Editor+Preview" height="500px" navbar="false" console](id#filepath)
```

`button` renders a link button instead of an embedded editor — useful for large sandboxes.

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | — | embed title |
| `layout` | `'Preview' \| 'Editor' \| 'Editor+Preview'` | `Preview` | panel layout |
| `height` | `string` | — | embed height |
| `navbar` | `boolean` | `true` | show sandbox navbar |
| `console` | `boolean` | `false` | show console panel |
| `filepath` | appended to `id` as `#filepath` | — | initially opened file |

## Examples

```md
@[codesandbox](5wyzu)

@[codesandbox button](reaction/5wyzu)

@[codesandbox title="Vue 示例" layout="Editor+Preview" height="500px" navbar="false" console](5wyzu#src/App.vue)
```
