---
url: /en/guide/markdown/demo-wrapper/index.md
---
## Overview

Sometimes you may need to supplement your content with examples but want them to be presented
separately from other content. The theme supports adding demo containers in Markdown files.

## Syntax

```md
::: demo-wrapper
Add your demo here
:::
```

## Options

* `title="xxx"`: Title
* `no-padding`: Remove padding
* `img`: Use when containing only images
* `height="xxx"`: Height

## Examples

Containing only images:

```md
::: demo-wrapper img no-padding
![hero](/images/custom-hero.jpg)
:::
```

**Output:**
::: demo-wrapper img no-padding
![hero](/images/custom-hero.jpg)
:::

Containing markdown syntax:

```md
::: demo-wrapper title="Title"
### Level 3 Heading

This is content inside the demo container.
:::
```

**Output:**
::: demo-wrapper title="Title"

### Level 3 Heading

This is content inside the demo container.
:::

Containing HTML/Vue code:

```md
::: demo-wrapper
<h1 class="your-demo-title">This is a heading</h1>
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
::: demo-wrapper

:::
