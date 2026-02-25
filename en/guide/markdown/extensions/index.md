---
url: /en/guide/markdown/extensions/index.md
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

The theme automatically generates a new link for each md file and stores it in the `permalink` of the corresponding md file's frontmatter.
You can modify these links at any time.
You can also disable this feature via the `theme.autoFrontmatter` option, reverting to VuePress's default behavior.

### Internal Links

There are three ways to use internal links:

* Use the generated `permalink` as the target for the internal link.
* Use the relative path of the md file as the target for the internal link.
* Use the absolute path of the md file as the target for the internal link.
  The absolute path `/` indicates starting from the `${sourceDir}` directory.

```md
[Markdown](/guide/markdown/)

[Markdown](./basic.md)
```

Renders as:

[Markdown](/guide/markdown/)

[Markdown](./basic.md)

### External Links

External links have `target="_blank" rel="noreferrer"`:

[VuePress](https://v2.vuepress.vuejs.org/)

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

## Table of Contents

**Input:**

```md
[[TOC]]
```

**Output:**

\[\[TOC]]

## Superscripts and Subscripts

* Use `^ ^` for superscript notation.
* Use `~ ~` for subscript notation.

**Input:**

```md
- 19^th^
- H~2~O
```

**Output:**

* 19^th^
* H~2~O

## Custom Alignment

**Input:**

```md
::: left
Left-aligned content
:::

::: center
Centered content
:::

::: right
Right-aligned content
:::
```

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

## Task Lists

**Input:**

```md
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
```

**Output:**

* \[ ] Task 1
* \[x] Task 2
* \[ ] Task 3

## Footnotes

**Input:**

```md
The farthest distance in the world Is not the distance between life and death But you don't know I love you when I stand in front of you.[^footnote1]。

[^footnote1]: From India.Rabindranath Tagore **The Farthest Distance in the World**
```

**Output:**

The farthest distance in the world Is not the distance between life and death But you don't know I love you when I stand in front of you.\[^footnote1]。

\[^footnote1]: From India.Rabindranath Tagore **The Farthest Distance in the World**
