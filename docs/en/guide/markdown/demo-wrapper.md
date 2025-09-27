---
title: Demo Wrapper
createTime: 2025/03/24 21:49:01
icon: icon-park-outline:eyes
permalink: /en/guide/markdown/demo-wrapper/
outline: 2
---

## Overview

Sometimes, you may need to add examples in your content but want them to be presented separately from other content.
The theme supports adding demo wrapper in Markdown files.

## Syntax

````md
::: demo-wrapper
Add your example here
:::
````

## Options

- `title="xxx"`: Title
- `no-padding`: No padding
- `img`: Use when only containing an image
- `height="xxx"`: Height

## Example

Image only:

```md
::: demo-wrapper img no-padding
![hero](/images/custom-hero.jpg)
:::
```

**Output:**
::: demo-wrapper img no-padding
![hero](/images/custom-hero.jpg)
:::

Markdown content:

```md
::: demo-wrapper title="Title"
### Third-level heading

This is the content within the demo wrapper.
:::
```

**Output:**
::: demo-wrapper title="Title"

### Third-level heading

This is the content within the demo wrapper.
:::

HTML/Vue code:

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

<h1 class="your-demo-title">This is a title</h1>
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
