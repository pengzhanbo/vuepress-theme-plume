---
title: Annotation
icon: iconamoon:comment-add-light
createTime: 2025/03/24 17:19:13
permalink: /en/guide/markdown/annotation/
---

## Description

==Annotation== is a special Markdown syntax for adding extra information, explanations, or hints in documents.

Annotations are not displayed directly in the document and require user interaction to be shown.

## Configuration

This feature is not enabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      annotation: true, // [!code ++]
    }
  })
})
```

## Syntax

==Annotation== syntax consists of two parts:

### Inline Annotation

Insert an annotation tag inline using the `[+label]` syntax.

The annotation tag is composed of `[+` + `label` + `]`. To distinguish it from the content, there should be a space before `[+label]`.

`label` is the annotation tag and can be any string.

::: important The symbol `+` is required
:::

### Define Annotation

Define the annotation in a separate area of the document using the `[+label]:` syntax.

The annotation definition area is composed of `[+` + `label` + `]:` + `content`.

`label` should match the `[+label]` used earlier to mark the annotation.

**Content** can be written after the `:`:

```md
[+label]: Here is the content, which can use **Markdown** syntax.
```

**Content** can also start on the next line with indentation, and should maintain consistent indentation for multiple lines.

```md
[+label]:
  Here is the content.
  Indent consistently, this line is also part of the content.

  Even if the previous line is blank, but this line's indentation is consistent, it is still part of the content.
  You can use **Markdown** syntax.

This line is no longer indented, so the annotation definition for this tag ends on the previous line.
```

The content of the annotation definition is not rendered directly in the document, but is displayed when the `[+label]` inline annotation is clicked.

## Example

### Example 1

**Input:**

```md
The site is powered by VuePress [+vuepress].

[+vuepress]:
  VuePress is a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator  ) (SSG).
  Designed specifically for building fast, content-focused websites.
```

**Output:**

The site is powered by VuePress [+vuepress].

[+vuepress]:
  VuePress is a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator  ) (SSG).
  Designed specifically for building fast, content-focused websites.

### Example 2

**Multiple annotations for the same `label`, rendered as a list.**

**Input:**

```md
The Four Great Classical Novels of ancient China [+classics] are widely known.

[+classics]:
  **Romance of the Three Kingdoms:**

  Set against the history of the Three Kingdoms period, it depicts the political and military struggles among the Wei, Shu, and Wu kingdoms, creating numerous historical figures like Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.

[+classics]:
  **Journey to the West:**

  Tells the story of Tang僧 and his four disciples (Sun Wukong, Zhu Bajie, Sha僧, and White Dragon Horse) on their pilgrimage to the West for Buddhist scriptures, filled with mythological elements and fantastic adventures.

[+classics]:
  **Dream of the Red Chamber:**

  Set against the rise and fall of the four major families (Jia, Shi, Wang, and Xue), it depicts the love tragedy of Jia Baoyu, Lin Daiyu, and Xue Baochai, showcasing the decadence and decline of feudal society.

[+classics]:
  **Water Margin:**

  Depicts the story of 108 heroes led by Song Jiang gathering at Liangshan泊 to resist the court during the late Northern Song Dynasty, revealing the social reality of oppression leading to rebellion.
```

**Output:**

The Four Great Classical Novels of ancient China [+classics] are widely known.

[+classics]:
  **Romance of the Three Kingdoms:**

  Set against the history of the Three Kingdoms period, it depicts the political and military struggles among the Wei, Shu, and Wu kingdoms, creating numerous historical figures like Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.

[+classics]:
  **Journey to the West:**

  Tells the story of Tang僧 and his four disciples (Sun Wukong, Zhu Bajie, Sha僧, and White Dragon Horse) on their pilgrimage to the West for Buddhist scriptures, filled with mythological elements and fantastic adventures.

[+classics]:
  **Dream of the Red Chamber:**

  Set against the rise and fall of the four major families (Jia, Shi, Wang, and Xue), it depicts the love tragedy of Jia Baoyu, Lin Daiyu, and Xue Baochai, showcasing the decadence and decline of feudal society.

[+classics]:
  **Water Margin:**

  Depicts the story of 108 heroes led by Song Jiang gathering at Liangshan泊 to resist the court during the late Northern Song Dynasty, revealing the social reality of oppression leading to rebellion.
