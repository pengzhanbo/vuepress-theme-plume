---
url: /en/guide/markdown/window/index.md
---
## Overview

Sometimes you may need to supplement your content with examples but want them to be presented
separately from other content. The theme supports adding demo containers in Markdown files.

## Syntax

```md
::: window
Add your demo here
:::
```

## Options

* `title="xxx"`: Title
* `height="200px"`: Height
* `gap="20px"`: Left and right padding

## Examples

Containing only images:

```md
::: window
![hero](/images/custom-hero.jpg)
:::
```

**Output:**
::: window
![hero](/images/custom-hero.jpg)
:::

Containing markdown syntax:

```md
::: window title="Title"
### Level 3 Heading

This is content inside the demo container.
:::
```

**Output:**
::: window title="Title"

### Level 3 Heading

This is content inside the demo container.
:::

Containing HTML/Vue code:

```md
::: window
<h2 class="your-demo-title">This is a heading</h2>
<p class="your-demo-paragraph">This is a paragraph</p>

<style>
  .your-demo-title {
    color: red;
  }
  .your-demo-paragraph {
    color: blue;
  }
</style>
:::
```

**Output:**
::: window

:::
