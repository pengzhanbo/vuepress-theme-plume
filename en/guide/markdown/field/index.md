---
url: /en/guide/markdown/field/index.md
---
## Overview

In markdown, use the `::: field` container with JSDoc-style tags to describe field information,
including field name, field type, whether required, default value, details, and other information.

It is suitable for scenarios such as describing fields in configuration or component Props.

You can also use the additional `:::: field-group` container to combine multiple `::: field` entries.

## Enable

This feature is not enabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      field: true, // [!code ++]
    },
  })
})
```

## Syntax

Inside the `::: field` container, use JSDoc-style tags to describe field information. Each tag should occupy its own line.

Non-tag lines are merged into the `@description` tag as the field description by default.

```md
<!-- Single field -->
::: field fieldName
@type Type
@required
@default default value
@description Field description
Multi-line field description
:::

<!-- Field group -->
:::: field-group

::: field fieldName
@type Type
@required
@default default value
@description Field description
Multi-line field description
:::

::: field fieldName
@type Type
@required
@default default value
@description Field description
:::

::::
```

## Field Tags

Supports `@name`, `@type`, `@default`, `@required`, `@deprecated`, `@optional`, and `@description` tags.

| Tag | Description |
| --- | --- |
| `@name` | Override the field name (default uses the text following the `:::field` line as the name) |
| `@type` | Field type annotation |
| `@default` | Default value |
| `@required` | Mark as required field |
| `@deprecated` | Mark as deprecated field |
| `@optional` | Mark as optional field |
| `@description` | Explicit description text; any non-tag lines are also included in the description |

## Examples

**Input:**

```md
::: field theme
@type ThemeConfig
@required
@default {}

Theme configuration
:::

::: field enabled
@type boolean
@optional
@default true

Whether enabled
:::
```

**Output:**

::: field theme
@type ThemeConfig
@required
@default {}

Theme configuration
:::

::: field enabled
@type boolean
@optional
@default true

Whether enabled
:::

**Input:**

```md
:::: field-group
::: field theme
@type ThemeConfig
@required
@default { base: '/' }
Theme configuration
:::

::: field enabled
@type boolean
@optional
@default true

Whether enabled
:::

::: field callback
@type (...args: any[]) => void
@optional
@default () => (){}
<Badge type="tip" text="New in v1.0.0"  />
Callback function
:::

::: field other
@type string
@deprecated

<Badge type="danger" text="Deprecated in v0.9.0"  />
Deprecated property
:::
::::
```

**Output:**

:::: field-group
::: field theme
@type ThemeConfig
@required
@default { base: '/' }
Theme configuration
:::

::: field enabled
@type boolean
@optional
@default true

Whether enabled
:::

::: field callback
@type (...args: any\[]) => void
@optional
@default () => (){}

Callback function
:::

::: field other
@type string
@deprecated
