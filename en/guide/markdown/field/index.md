---
url: /en/guide/markdown/field/index.md
---
## Overview

In Markdown, use the `::: field` container to describe field information, including field name,
field type, whether it's required, default value, description, and other details.

It's suitable for describing fields in configurations, component Props, and similar scenarios.

You can also use the additional `:::: field-group` container to group multiple `::: field` containers.

## Enable

This feature is disabled by default. You need to enable it in the `theme` configuration.

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

```md
<!-- Single Field -->
::: field name="Field Name" type="Type" required default="Default Value"
Field description information
:::

<!-- Field Group -->
:::: field-group

::: field name="Field Name" type="Type" required default="Default Value"
Field description information
:::

::: field name="Field Name" type="Type" required default="Default Value"
Field description information
:::

::::
```

## Properties

:::: field-group
::: field name="name" required type="string"
Field name
:::

::: field name="type" type="string" optional
Field type
:::

::: field name="required" type="boolean" optional
Whether the field is required
:::

::: field name="optional" type="boolean" optional
Whether the field is optional
:::

::: field name="deprecated" type="boolean" optional
Whether the field is deprecated
:::

::: field name="default" type="string" optional
Default value. If it's an empty string, use `default="''"`
:::
::::

## Examples

**Input:**

```md
::: field name="theme" type="ThemeConfig" required default="{}"
Theme configuration
:::

::: field name="enabled" type="boolean" optional default="true"
Whether enabled
:::
```

**Output:**

::: field name="theme" type="ThemeConfig" required default="{}"
Theme configuration
:::

::: field name="enabled" type="boolean" optional default="true"
Whether enabled
:::

**Input:**

```md
:::: field-group
::: field name="theme" type="ThemeConfig" required default="{ base: '/' }"
Theme configuration
:::

::: field name="enabled" type="boolean" optional default="true"
Whether enabled
:::

::: field name="callback" type="(...args: any[]) => void" optional default="() => {}"
<Badge type="tip" text="v1.0.0 New"  />
Callback function
:::

::: field name="other" type="string" deprecated
<Badge type="danger" text="v0.9.0 Deprecated"  />
Deprecated property
:::
::::
```

**Output:**

:::: field-group
::: field name="theme" type="ThemeConfig" required default="{ base: '/' }"
Theme configuration
:::

::: field name="enabled" type="boolean" optional default="true"
Whether enabled
:::

::: field name="callback" type="(...args: any\[]) => void" optional default="() => {}"

Callback function
:::

::: field name="other" type="string" deprecated

Deprecated property
:::
::::
