---
title: Abbreviation
icon: mdi:tooltip-question-outline
createTime: 2025/03/24 17:07:33
permalink: /en/guide/markdown/abbreviation/
---

## Overview

**Abbreviations** refer to short forms used in Markdown, such as technical terms like W3C and ECMA.

When hovering over an abbreviation, the full term will be displayed along with its definition or explanation.

## Configuration

This feature is disabled by default. Enable it in `theme` configuration:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      abbr: true, // [!code ++]
    }
  })
})
```

## Syntax

In Markdown, define abbreviations using `*[ABBR]: Description` on separate lines. The description may include the abbreviation's definition, explanation, etc.

Place the abbreviation within `[]` and its description after `:`. The description supports Markdown inline syntax.

If the Markdown plain text contains defined abbreviations, the explanation of the abbreviation will be automatically displayed when the mouse moves over it.

**Input:**

```md
The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
```

**Output:**

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
*[ECMA]: European Computer Manufacturers Association

::: warning Abbreviations should be standalone words or phrases. For Chinese abbreviations, add spaces around the term to ensure proper detection.
:::
