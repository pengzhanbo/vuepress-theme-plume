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

Supports the following tags:

| Tag | Description |
| --- | --- |
| `@name` | Override the field name (defaults to the text following the `:::field` line) |
| `@type` | Field type annotation |
| `@typeLink` | Field type reference link; renders the `@type` as a hyperlink |
| `@required` | Mark as required field |
| `@deprecated` | Mark as deprecated field, optionally with the version/date of deprecation |
| `@experimental` | Mark as experimental field, optionally with the version/date |
| `@default` | Default value |
| `@enum` | Candidate values list, separated by `\|`; multiple `@enum` lines are appended |
| `@since` | Mark the version from which the field is available (only the first occurrence takes effect) |
| `@unit` | Unit annotation |
| `@format` | Format annotation |
| `@constraint` | Constraint annotation |
| `@description` | Explicit description text; any non-tag lines are also included in the description |

Fields are optional by default and are only shown as required when marked with `@required`.

## Examples

### Basic Usage

A single `::: field` container describes one field. The field name defaults to the text following the
`::: field` line, and non-tag lines are merged into the description.

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
@default true

Whether enabled
:::

### Marking Field Status

The `@deprecated` and `@experimental` tags can either be declared on their own to mark a field's
deprecated or experimental status, or include additional version/date information.

**Input:**

```md
::: field legacy
@deprecated

Legacy field, no longer recommended
:::

::: field beta
@experimental

Experimental field, the API may change
:::
```

**Output:**

::: field legacy
@deprecated

Legacy field, no longer recommended
:::

::: field beta
@experimental

Experimental field, the API may change
:::

### Combined Tags

Use the `:::: field-group` container to combine multiple fields and describe complete field information with various tags:

**Input:**

```md
:::: field-group
::: field theme
@type ThemeConfig
@typeLink https://theme-plume.vuejs.press/config/
@required
@default { base: '/' }
Theme configuration
:::

::: field fontSize
@type number
@required
@since v1.2.0
@default 14
@unit px
@format integer
@constraint 12 ~ 48

Font size
:::

::: field mode
@type 'light' | 'dark' | 'auto'
@experimental v2.0.0-beta
@enum light | dark | auto
@default auto

Theme mode
:::

::: field callback
@type (...args: any[]) => void
@default () => (){}
@description Callback function invoked at specific times
<Badge type="tip" text="New in v1.0.0" />
:::

::: field other
@type string
@deprecated v0.9.0

Deprecated property
:::
::::
```

**Output:**

:::: field-group
::: field theme
@type ThemeConfig
@typeLink https://theme-plume.vuejs.press/config/
@required
@default { base: '/' }
Theme configuration
:::

::: field fontSize
@type number
@required
@since v1.2.0
@default 14
@unit px
@format integer
@constraint 12 ~ 48

Font size
:::

::: field mode
@type 'light' | 'dark' | 'auto'
@experimental v2.0.0-beta
@enum light | dark | auto
@default auto

Theme mode
:::

::: field callback
@type (...args: any\[]) => void
@default () => (){}
@description Callback function invoked at specific times

:::

::: field other
@type string
@deprecated v0.9.0

Deprecated property
:::
::::
