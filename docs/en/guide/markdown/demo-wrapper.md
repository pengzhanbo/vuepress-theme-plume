---
title: Demo Container
createTime: 2025/10/08 14:47:12
icon: fxemoji:window
permalink: /en/guide/markdown/window/
outline: 2
badge:
  text: Change
  type: warning
---

## Overview

Sometimes you may need to supplement your content with examples but want them to be presented
separately from other content. The theme supports adding demo containers in Markdown files.

## Syntax

````md
::: window
Add your demo here
:::
````

## Options

- `title="xxx"`: Title
- `no-padding`: Remove padding
- `img`: Use when containing only images
- `height="xxx"`: Height

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
::: window

<h1 class="your-demo-title">This is a heading</h1>
<p class="your-demo-paragraph">This is a paragraph</p>

<style>
  .your-demo-title {
    color: red !important;
  }
  .your-demo-paragraph {
    color: blue !important;
  }
</style>

:::
