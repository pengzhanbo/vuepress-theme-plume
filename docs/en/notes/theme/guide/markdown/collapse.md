---
title: Collapsible panel
icon: carbon:collapse-categories
createTime: 2025/03/25 10:13:04
permalink: /en/guide/markdown/collapse/
badge:
  type: tip
  text: 1.0.0-rc.137 +
---

## Overview

In Markdown, the `::: collapse` container, combined with Markdown unordered list syntax, can be used to create ==collapsible panels==.

- It supports setting the mode to **accordion** using the `accordion` option.

## Enable

This feature is not enabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      collapse: true, // [!code ++]
    }
  })
})
```

## Usage

In Markdown, use the `::: collapse` container with Markdown unordered list syntax, where each item represents a separate collapsible area.

```md title="collapse.md"
::: collapse
- Title 1        <!-- Title, click to control expand/collapse -->
                <!-- There must be an empty line between the title and the content -->
  Content          <!-- Content, the collapsible area -->

- Title 2

  Content
:::
```

For each item in the list:

- From the **first line** to the **first empty line** is the **title**.
- **After the first empty line**: The main content.

:::important Please note the correct indentation
:::

**A simple example:**

**Input:**

```md
::: collapse
- Title 1

  Main content

- Title 2

  Main content
:::
```

**Output:**

::: collapse

- Title 1

  Main content

- Title 2

  Main content
:::

## Configuration

After the `::: collapse` container syntax, you can add configuration options:

- `accordion`: Sets the collapsible panels to ==accordion== mode. In accordion mode, only one panel can be expanded at a time. Clicking another panel will close the previously opened one.
- `expand`: Expands all panels by default. This option is invalid in accordion mode.

Before the title of each list item, you can use special markers `:+` or `:-` to set the initial state of the item to **expanded** or **collapsed**.

## Examples

### Basic Usage

**Input:**

```md
::: collapse
- Title 1

  Main content

- Title 2

  Main content
:::
```

**Output:**

::: collapse

- Title 1

  Main content

- Title 2

  Main content
  :::

### Expand All by Default

Add the `expand` option to expand all panels by default.

**Input:**

```md /expand/
::: collapse expand
- Title 1

  Main content

- Title 2

  Main content
:::
```

**Output:**

::: collapse expand

- Title 1

  Main content

- Title 2

  Main content
  :::

### Accordion Mode

Add the `accordion` option to set the mode to accordion, allowing only one panel to be expanded at a time. Clicking another panel will close the previously opened one.

```md /accordion/
::: collapse accordion
- Title 1

  Main content

- Title 2

  Main content

- Title 3

  Main content
:::
```

**Output:**

::: collapse accordion

- Title 1

  Main content

- Title 2

  Main content

- Title 3

  Main content
  :::

### Expand Items with `:+`

By default, all collapsible panels are closed. You can use the `:+` marker to set the initial state of an item to expanded.

**Input:**

```md /:+/
::: collapse
- Title 1

  Main content

- :+ Title 2

  Main content

- :+ Title 3

  Main content
:::
```

**Output:**

::: collapse

- Title 1

  Main content

- :+ Title 2

  Main content

- :+ Title 3

  Main content
  :::

### Collapse Items with `:-`

When the `expand` option is configured, all panels are expanded by default. You can use the `:-` marker to set the initial state of an item to collapsed.

**Input:**

```md /:-/
::: collapse expand
- Title 1

  Main content

- :- Title 2

  Main content

- Title 3

  Main content
:::
```

**Output:**

::: collapse expand

- Title 1

  Main content

- :- Title 2

  Main content

- Title 3

  Main content
  :::
