---
url: /en/guide/components/badge/index.md
---
## Overview&#x20;

Use the `<Badge>` component to display inline information such as status or labels.

Pass the content you want to display to the `text` prop of the `<Badge>` component.

## Props

:::: field-group

::: field name="type" type="'info' | 'tip' | 'warning' | 'danger' | string" default="'tip'" optional
Badge type. Different types use different color schemes. Custom types are supported.
:::

::: field name="text" type="string" default="''" optional
Badge text content.
:::

::: field name="color" type="string" optional
Custom badge text color.
:::

::: field name="bgColor" type="string" optional
Custom badge background color.
:::

::: field name="borderColor" type="string" optional
Custom badge border color.
:::

::::

## Examples

**Input:**

```md :no-line-numbers
- VuePress - <Badge type="info" text="v2" />
- VuePress - <Badge type="tip" text="v2" />
- VuePress - <Badge type="warning" text="v2" />
- VuePress - <Badge type="danger" text="v2" />
- VuePress - <Badge text="v2" color="#8e5cd9" bg-color="rgba(159, 122, 234, 0.16)" />
```

**Output:**

* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;

Using custom `type` enables richer visual presentations.

**Input:**

1. Add predefined styles in the theme's [custom style file](../custom/style.md.md):

   ```css
   /* Light theme */
   .vp-badge.important {
     color: #8e5cd9;
     background-color: rgba(159, 122, 234, 0.14);
     border-color: transparent;
   }

   /* Dark theme */
   [data-theme="dark"] .vp-badge.important {
     color: #8e5cd9;
     background-color: rgba(159, 122, 234, 0.16);
     border-color: transparent;
   }

   /**
   'important' is a custom type
   */
   ```

2. Use the custom `type`:

   ```md :no-line-numbers
   VuePress - <Badge type="important" text="v2" />
   ```

   **Output:**

   VuePress -&#x20;
