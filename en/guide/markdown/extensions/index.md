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

## Superscript (Sup)

Superscript is used to display text above normal text, commonly for mathematical exponents (e.g., X²), ordinal numbers (e.g., 19th), etc. Content wrapped with `^ ^` will be rendered as superscript.

### Syntax

```md
X^2^
19^th^
```

### Effect

X^2^

19^th^

## Subscript (Sub)

Subscript is used to display text below normal text, commonly for chemical formulas (e.g., H₂O), mathematical variables (e.g., a₁), etc. Content wrapped with `~ ~` will be rendered as subscript.

### Syntax

```md
H~2~O
```

### Effect

H~2~O

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

Task lists are used to create list items with checkboxes, suitable for displaying to-dos, task progress, or checklists. Use `- [ ]` for incomplete tasks and `- [x]` for completed tasks.

### Syntax

```md
- [ ] Task 1
- [x] Task 2
- [ ] Task 3
```

### Effect

* \[ ] Task 1
* \[x] Task 2
* \[ ] Task 3

## Footnotes

Footnotes are used to add supplementary notes at the bottom of a document without affecting the reading flow of the main text. By adding footnote markers (`[^identifier]`) in the text and defining the footnote content anywhere in the document, readers can click the marker to jump to the corresponding note. Footnote identifiers can be numbers or any descriptive text.

### Syntax

```md
This is a paragraph[^1] that needs a footnote explanation.

[^1]: This is the footnote content.
```

Descriptive identifiers are also supported:

```md
Since ancient times, who has not died? Let my loyal heart illuminate the annals of history[^footnote1].

[^footnote1]: From Song Dynasty · Wen Tianxiang **"Passing Lingdingyang"**
```

### Effect

This is a paragraph\[^1] that needs a footnote explanation.

\[^1]: This is the footnote content.

***

Since ancient times, who has not died? Let my loyal heart illuminate the annals of history\[^footnote1].

\[^footnote1]: From Song Dynasty · Wen Tianxiang **"Passing Lingdingyang"**
