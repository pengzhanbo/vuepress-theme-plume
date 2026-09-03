---
url: /en/guide/components/badge/index.md
---
## Overview&#x20;

Use the `<Badge>` component to display inline information such as status or labels.

Pass the content you want to display to the `text` prop of the `<Badge>` component.

## Props

:::: field-group

::: field type
@type `'info' | 'tip' | 'warning' | 'danger' | string`
@default `'tip'`
@optional

Badge type. Different types use different color schemes. Custom types are supported.
:::

::: field text
@type `string`
@default `''`
@optional

Badge text content.
:::

::: field color
@type `string`
@optional

Custom badge text color.
:::

::: field bgColor
@type `string`
@optional

Custom badge background color.
:::

::: field borderColor
@type `string`
@optional

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

## Use Cases

The `<Badge>` component has several common use cases in practical documentation writing. The following examples demonstrate some typical scenarios.

### Status Indicators

In feature lists or descriptions, use `<Badge>` to mark recommended, new, or important features to help readers quickly identify key information.

**Input:**

```md :no-line-numbers
- Article Encryption <Badge type="tip" text="Recommended" />
- Full-site Encryption <Badge type="info" text="New" />
- Comment System <Badge type="danger" text="Important" />
```

**Output:**

* Article Encryption&#x20;
* Full-site Encryption&#x20;
* Comment System&#x20;

### Version Markers

In API documentation or feature descriptions, use `<Badge>` to mark the minimum version required for a feature, making it easy for readers to determine compatibility.

**Input:**

```md :no-line-numbers
- `sidebarCollapsed` option <Badge type="info" text="v1.0.0-rc.143 +" />
- Collection Configuration <Badge type="warning" text="v1.0.0-rc.120 +" />
```

**Output:**

* `sidebarCollapsed` option&#x20;
* Collection Configuration&#x20;

### Category Tags

In documentation section headings, use `<Badge>` to mark experimental or deprecated features, alerting readers to risks before use.

**Input:**

```md :no-line-numbers
## Custom Section Type <Badge type="warning" text="Experimental" />

## Legacy Configuration <Badge type="danger" text="Deprecated" />
```

**Output:**

* Custom Section Type&#x20;
* Legacy Configuration&#x20;
