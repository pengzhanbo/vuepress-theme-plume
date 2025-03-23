---
title: Extensions
icon: fluent-mdl2:auto-enhance-on
createTime: 2025/03/03 14:04:34
permalink: /en/guide/markdown/extensions/
tags:
  - Guide
  - markdown
---

## Header Anchors

Headers automatically have anchors applied.

### Custom Anchors

To specify a custom anchor for a header instead of using the auto-generated one, add a suffix to the header:

```md
# Using a Custom Anchor {#my-anchor}
```

This allows linking to the header as `#my-anchor` instead of the default `#using-a-custom-anchor`.

## Links

Internal and external links are specially processed.

The theme automatically generates a new link for each md file and stores it in the `permalink` of the corresponding md file's frontmatter. You can modify these links at any time. You can also disable this feature via the `theme.autoFrontmatter` option, reverting to VuePress's default behavior.

### Internal Links

There are three ways to use internal links:

- Use the generated `permalink` as the target for the internal link.
- Use the relative path of the md file as the target for the internal link.
- Use the absolute path of the md file as the target for the internal link. The absolute path `/` indicates starting from the `${sourceDir}` directory.

```md
[Markdown](/guide/markdown/)

[Markdown](./basic.md)
```

Renders as:

[Markdown](/guide/markdown/)

[Markdown](./basic.md)

### External Links

External links have `target="_blank" rel="noreferrer"`:

[VuePress](https://v2.vuepress.vuejs.org/  )

## GitHub-Style Tables

**Input:**

```md
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

**Output:**

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## Emoji :tada:

**Input:**

```md
:tada: :100:
```

**Output:**

:tada: :100:

You can find the [list of all supported emojis](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs  ) here.

## Table of Contents

**Input:**

```md
[[TOC]]
```

**Output:**

[[TOC]]

## Custom Containers

Custom containers can be defined by their type, title, and content.

### Default Title

**Input:**

```md
::: note
This is a note box
:::

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: caution
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output:**

::: note
This is a note box
:::

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: caution
This is a dangerous warning.
:::

::: details
This is a details block.
:::

### Custom Title

You can set a custom title by appending text after the container's "type".

**Input:**

````md
::: caution STOP
Danger zone, do not proceed
:::

::: details Click to view code
```js
console.log('Hello, VitePress!')
```
:::
````

**Output:**

::: caution STOP
Danger zone, do not proceed
:::

::: details Click to view code

```js
console.log('Hello, VitePress!')
```

:::

## GitHub-Style Alerts

The theme also supports rendering [GitHub-style alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts  ). They are rendered in the same way as [custom containers](#custom-containers).

**Input:**

```md
> [!NOTE]
> Emphasizes important information that users should know even when skimming the document.

> [!TIP]
> Advisory information that helps users achieve their goals more smoothly.

> [!IMPORTANT]
> Information crucial for users to achieve their goals.

> [!WARNING]
> Key content that requires immediate user attention due to potential risks.

> [!CAUTION]
> Negative impacts of certain actions.
```

**Output:**

> [!NOTE]
> Emphasizes important information that users should know even when skimming the document.

> [!TIP]
> Advisory information that helps users achieve their goals more smoothly.

> [!IMPORTANT]
> Information crucial for users to achieve their goals.

> [!WARNING]
> Key content that requires immediate user attention due to potential risks.

> [!CAUTION]
> Negative impacts of certain actions.

## Mathematical Equations

**Input:**

````When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |
````

**Output:**

When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |

## Superscripts and Subscripts

- Use `^ ^` for superscript notation.
- Use `~ ~` for subscript notation.

**Input:**

```md
- 19^th^
- H~2~O
```

**Output:**

- 19^th^
- H~2~O

## Custom Alignment

**Input:**

````md
::: left
Left-aligned content
:::

::: center
Centered content
:::

::: right
Right-aligned content
:::
````

**Output:**

::: left
Left-aligned content
:::

::: center
Centered content
:::

::: right
Right-aligned content
:::

## Attribute Support

You can use special syntax to add attributes to Markdown elements.

**Adding attributes to an image:**

This adds a class attribute named `full-width` and a `width` attribute with the value `100%` to the image.

```md
![](/plume.png){.full-width width="100%"}
```

Other attributes are also supported:

```md
A paragraph with text. {#p .a .b align=center customize-attr="content with spaces"}
```

This will be rendered as:

```html
<p id="p" class="a b" align="center" customize-attr="content with spaces">
  A paragraph with text.
</p>
```

## Task Lists

**Input:**

````md
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
````

**Output:**

- [ ] Task 1
- [x] Task 2
- [ ] Task 3

## Footnotes

**Input:**

````md
The farthest distance in the world Is not the distance between life and death But you don't know I love you when I stand in front of you.[^footnote1]。

[^footnote1]: From India.Rabindranath Tagore **The Farthest Distance in the World**
````

**Output:**

The farthest distance in the world Is not the distance between life and death But you don't know I love you when I stand in front of you.[^footnote1]。

[^footnote1]: From India.Rabindranath Tagore **The Farthest Distance in the World**
