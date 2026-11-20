# Field (API / props documentation)

## Enable

```ts
markdown: { field: true } // enables `::: field` and `::: field-group`
```

## Syntax

```md
:::: field-group

::: field title
@type `string`
@default `''`
@required

字段说明。
:::

::: field disabled
@type `boolean`
@default `false`
是否禁用。
:::

::::
```

The field name comes from the positional text after `::: field` (or from `@name`). Any non-tag line is part of
the description, and a **blank line** separates tags from the description body.

## Tags

| Tag | Meaning |
| --- | --- |
| `@name` | override the field name |
| `@type` | type annotation |
| `@typeLink` | link for the type |
| `@default` | default value |
| `@required` | mark as required (otherwise optional) |
| `@deprecated` | mark deprecated, optionally `@deprecated v0.9.0` |
| `@experimental` | mark experimental |
| `@since` | version introduced |
| `@enum` | enumerable values, `\|` separated, repeatable on multiple lines |
| `@unit` | unit of the value |
| `@format` | expected format |
| `@constraint` | validation constraint |
| `@description` | explicit description |

## Use cases

- Component prop tables
- Config option references
- API signature documentation

Component-style props example:

```md
:::: field-group
::: field align
@type `'left' | 'center' | 'right'`
@default `left`
表格对齐方式
:::
::::
```
