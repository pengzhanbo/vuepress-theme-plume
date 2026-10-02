---
url: /en/guide/markdown/collapse/index.md
---
## Overview

In markdown, use the `::: collapse` container with markdown unordered list syntax to implement ==collapse panels==.

* Supports ==accordion== mode via the `accordion` setting

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

* Everything from the **first line** to the **first empty line** is considered the **title**

* **After the first empty line**: Content

:::important Please ensure correct indentation
:::

**A simple example:**

**Input:**

```md
::: collapse
- Title 1

  Content

- Title 2

  Content
:::
```

**Output:**

::: collapse

* Title 1

  Content

* Title 2

  Content
  :::

## Configuration

After the `::: collapse` container syntax, follow with configuration options:

* `accordion`: Sets the collapse panel to ==accordion== mode. In accordion mode,
  only one panel can be expanded at a time; clicking other panels will close the previously opened panel.
* `expand`: Expands panels by default. Invalid in accordion mode.

In list items, before the title, use special markers `:+` / `:-` to set the initial state of the current item to **expanded / collapsed**.

## Examples

### Basic Usage

**Input:**

```md
::: collapse
- Title 1

  Content

- Title 2

  Content
:::
```

**Output:**

::: collapse

* Title 1

  Content

* Title 2

  Content
  :::

### Expand All by Default

Add the `expand` option to expand all panels by default.

**Input:**

```md /expand/
::: collapse expand
- Title 1

  Content

- Title 2

  Content
:::
```

**Output:**

::: collapse expand

* Title 1

  Content

* Title 2

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

**Output:**

::: collapse accordion

* Title 1

  Content

* Title 2

  Content

* Title 3

  Content
  :::

### `:+` Mark Item as Expanded

Collapse panels are closed by default. Use `:+` to mark items with an initial expanded state.

**Input:**

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

**Output:**

::: collapse

* Title 1

  Content

* :+ Title 2

  Content

* :+ Title 3

  Content
  :::

### `:-` Mark Item as Collapsed

When collapse panel is configured with `expand`, all panels are expanded by default. Use `:-` to mark items with an initial collapsed state.

**Input:**

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

**Output:**

::: collapse expand

* Title 1

  Content

* :- Title 2

  Content

* Title 3

  Content
  :::
