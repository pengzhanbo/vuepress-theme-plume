---
title: Abbreviations
icon: mdi:tooltip-question-outline
createTime: 2025/10/08 10:48:15
permalink: /en/guide/markdown/abbreviation/
---

## Overview

**Abbreviations** refer to acronyms used in Markdown, such as professional terms like W3C, ECMA, etc.

When hovering over an abbreviation, the full name of the term is displayed, and it can also include the definition and explanation of the abbreviation.

## Configuration

This feature is disabled by default. You need to enable it in the `theme` configuration.

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

In Markdown, use `*[Abbreviation]: Description` on a separate line to define an abbreviation.
The description can include the definition, explanation, etc., of the abbreviation.

Fill in the abbreviation within `[]`, and write the description after `:`. Markdown inline syntax can be used in the description.

If defined abbreviations appear in regular Markdown text, hovering over them will automatically display the abbreviation's explanation.

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

::: warning
Abbreviations should be independent words or phrases. For Chinese abbreviations, add spaces on both sides of the word to distinguish them.
:::
