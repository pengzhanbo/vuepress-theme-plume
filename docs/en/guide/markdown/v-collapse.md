---
title: Collapse Panel
icon: carbon:collapse-categories
createTime: 2025/10/08 22:27:22
permalink: /en/guide/markdown/collapse/
---

## Overview

In markdown, use the `::: collapse` container with markdown unordered list syntax to implement ==collapse panels==.

- Supports ==accordion== mode via the `accordion` setting

## Enable

This feature is disabled by default. You need to enable it in the `theme` configuration.

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

In markdown, use the `::: collapse` container with markdown unordered list syntax. Each item represents a separate collapsible section.

```md title="collapse.md"
::: collapse
- Title 1        <!-- Title, click to control expand/collapse -->
                 <!-- Must have an empty line between title and content -->
  Content        <!-- Content, the collapsible area -->

- Title 2

  Content
:::
```

For each list item:

- Everything from the __first line__ to the __first empty line__ is considered the __title__

- __After the first empty line__: Content

:::important Please ensure correct indentation
:::

__A simple example:__

__Input:__

```md
::: collapse
- Title 1

  Content

- Title 2

  Content
:::
```

__Output:__

::: collapse

- Title 1

  Content

- Title 2

  Content
:::

## Configuration

After the `::: collapse` container syntax, follow with configuration options:

- `accordion`: Sets the collapse panel to ==accordion== mode. In accordion mode,
  only one panel can be expanded at a time; clicking other panels will close the previously opened panel.
- `expand`: Expands panels by default. Invalid in accordion mode.

In list items, before the title, use special markers `:+` / `:-` to set the initial state of the current item to __expanded / collapsed__.

## Examples

### Basic Usage

__Input:__

```md
::: collapse
- Title 1

  Content

- Title 2

  Content
:::
```

__Output:__

::: collapse

- Title 1

  Content

- Title 2

  Content
:::

### Expand All by Default

Add the `expand` option to expand all panels by default.

__Input:__

```md /expand/
::: collapse expand
- Title 1

  Content

- Title 2

  Content
:::
```

__Output:__

::: collapse expand

- Title 1

  Content

- Title 2

  Content
:::

### Accordion Mode

Add the `accordion` option to set accordion mode, where only one panel can be expanded at a time.

```md /accordion/
::: collapse accordion
- Title 1

  Content

- Title 2

  Content

- Title 3

  Content
:::
```

__Output:__

::: collapse accordion

- Title 1

  Content

- Title 2

  Content

- Title 3

  Content
:::

### `:+` Mark Item as Expanded

Collapse panels are closed by default. Use `:+` to mark items with an initial expanded state.

__Input:__

```md /:+/
::: collapse
- Title 1

  Content

- :+ Title 2

  Content

- :+ Title 3

  Content
:::
```

__Output:__

::: collapse

- Title 1

  Content

- :+ Title 2

  Content

- :+ Title 3

  Content
:::

### `:-` Mark Item as Collapsed

When collapse panel is configured with `expand`, all panels are expanded by default. Use `:-` to mark items with an initial collapsed state.

__Input:__

```md /:-/
::: collapse expand
- Title 1

  Content

- :- Title 2

  Content

- Title 3

  Content
:::
```

__Output:__

::: collapse expand

- Title 1

  Content

- :- Title 2

  Content

- Title 3

  Content
:::
