---
url: /en/guide/markdown/annotation/index.md
---
## Description

\==Annotation== is a special syntax in Markdown used to add extra information, explanations, or hints to a document.

Annotations are not directly displayed in the document; they require the user to manually click to be revealed.

## Configuration

This feature is disabled by default. You need to enable it in the `theme` configuration.

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

The ==Annotation== syntax consists of two parts:

### Inline Annotation

Insert an annotation marker inline using the `[+label]` syntax.

The annotation marker is composed of `[+` + `label` + `]`.
To distinguish it clearly from the surrounding content, a space should be present at the left edge of `[+label]`.

`label` is the tag for the annotation and can be any string.

::: important The `+` symbol is required.
:::

### Defining Annotations

Define annotations in a separate area of the document using the `[+label]:` syntax.

The annotation definition area is composed of `[+` + `label` + `]:` + `Content`.

`label` should match the `[+label]` mentioned above and is used to identify the annotation tag.

**Content** can be written directly after the `:`:

```md
[+label]: This is the content. **Markdown** syntax can be used here.
```

**Content** can also start on the next line, but it must be indented. Consistent indentation should be maintained for multiple lines.

```md
[+label]:
  This is the content.
  The indentation is consistent, so this line is also part of the content.

  Even with a blank line above, this line is still consistently indented, so it is also content.
  **Markdown** syntax can be used.

This line is no longer indented, so the annotation definition for this tag ended on the previous line.
```

The content of the annotation definition is not rendered directly in the document.
It is presented only when the inline `[+label]` marker is clicked.

## Examples

### Example 1

**Input:**

```md
This site is powered by VuePress [+vuepress].

[+vuepress]:
  VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).
  It is specifically designed for building fast, content-centric sites.
```

**Output:**

This site is powered by VuePress \[+vuepress].

\[+vuepress]:
VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).
It is specifically designed for building fast, content-centric sites.

### Example 2

**Multiple annotations defined with the same `label` are rendered as a list.**

**Input:**

```md
The ancient Chinese **Four Great Classical Novels** [+novels] are household names.

[+novels]:
  **"Romance of the Three Kingdoms":**

  Set against the backdrop of the Three Kingdoms period in Chinese history, it depicts the political and military struggles between the states of Wei, Shu, and Wu, shaping the images of numerous historical figures such as Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.

[+novels]:
  **"Journey to the West":**

  Tells the story of the monk Xuanzang and his three disciples (Sun Wukong, Zhu Bajie, Sha Wujing, and the White Dragon Horse) on their journey to the West to obtain sacred Buddhist texts, filled with mythological elements and fantastical adventures.

[+novels]:
  **"Dream of the Red Chamber":**

  Set against the backdrop of the decline of the four major families Jia, Shi, Wang, and Xue, it depicts the love tragedy between Jia Baoyu, Lin Daiyu, and Xue Baochai, revealing the corruption and decay of feudal society.

[+novels]:
  **"Water Margin":**

  Depicts the story of 108 outlaws, led by Song Jiang, who gather at Liangshan Marsh during the late Northern Song Dynasty to rebel against the imperial government, showcasing the social reality of oppression leading to rebellion.
```

**Output:**

The ancient Chinese **Four Great Classical Novels** \[+novels] are household names.

\[+novels]:
**"Romance of the Three Kingdoms":**

Set against the backdrop of the Three Kingdoms period in Chinese history,
it depicts the political and military struggles between the states of Wei, Shu, and Wu,
shaping the images of numerous historical figures such as Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.

\[+novels]:
**"Journey to the West":**

Tells the story of the monk Xuanzang and his three disciples (Sun Wukong, Zhu Bajie, Sha Wujing,
and the White Dragon Horse) on their journey to the West to obtain sacred Buddhist texts,
filled with mythological elements and fantastical adventures.

\[+novels]:
**"Dream of the Red Chamber":**

Set against the backdrop of the decline of the four major families Jia, Shi, Wang, and Xue,
it depicts the love tragedy between Jia Baoyu, Lin Daiyu, and Xue Baochai, revealing the corruption and decay of feudal society.

\[+novels]:
**"Water Margin":**

Depicts the story of 108 outlaws, led by Song Jiang, who gather at Liangshan Marsh during the late
Northern Song Dynasty to rebel against the imperial government, showcasing the social reality of oppression leading to rebellion.

## Global Presets

For convenience, commonly used content annotations can be preset in the configuration to avoid repetitive definitions in each markdown file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      annotation: {
        vuepress: 'VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).It is specifically designed for building fast, content-centric sites.',
        novels: [
          '**"Romance of the Three Kingdoms":**\nSet against the backdrop of the Three Kingdoms period in Chinese history, it depicts the political and military struggles between the states of Wei, Shu, and Wu, shaping the images of numerous historical figures such as Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.',
          '**"Journey to the West":**\nTells the story of the monk Xuanzang and his three disciples (Sun Wukong, Zhu Bajie, Sha Wujing, and the White Dragon Horse) on their journey to the West to obtain sacred Buddhist texts, filled with mythological elements and fantastical adventures.',
          '**"Dream of the Red Chamber":**\nSet against the backdrop of the decline of the four major families Jia, Shi, Wang, and Xue, it depicts the love tragedy between Jia Baoyu, Lin Daiyu, and Xue Baochai, revealing the corruption and decay of feudal society.',
          '**"Water Margin":**\nDepicts the story of 108 outlaws, led by Song Jiang, who gather at Liangshan Marsh during the late Northern Song Dynasty to rebel against the imperial government, showcasing the social reality of oppression leading to rebellion.'
        ],
      }
    }
  })
})
```

It can also be achieved by configuring the `annotations` option in `markdown.env`.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      env: {
        annotations: {
          vuepress: 'VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).It is specifically designed for building fast, content-centric sites.',
          novels: [
            '**"Romance of the Three Kingdoms":**\nSet against the backdrop of the Three Kingdoms period in Chinese history, it depicts the political and military struggles between the states of Wei, Shu, and Wu, shaping the images of numerous historical figures such as Zhuge Liang, Cao Cao, Guan Yu, and Liu Bei.',
            '**"Journey to the West":**\nTells the story of the monk Xuanzang and his three disciples (Sun Wukong, Zhu Bajie, Sha Wujing, and the White Dragon Horse) on their journey to the West to obtain sacred Buddhist texts, filled with mythological elements and fantastical adventures.',
            '**"Dream of the Red Chamber":**\nSet against the backdrop of the decline of the four major families Jia, Shi, Wang, and Xue, it depicts the love tragedy between Jia Baoyu, Lin Daiyu, and Xue Baochai, revealing the corruption and decay of feudal society.',
            '**"Water Margin":**\nDepicts the story of 108 outlaws, led by Song Jiang, who gather at Liangshan Marsh during the late Northern Song Dynasty to rebel against the imperial government, showcasing the social reality of oppression leading to rebellion.'
          ],
        }
      }
    }
  })
})
```

Globally preset content annotations can be used in any markdown file.

**Input:**

```md
The ancient Chinese **Four Great Classical Novels** [+novels] are household names.
```

**Output:**

The ancient Chinese **Four Great Classical Novels** \[+novels] are household names.
