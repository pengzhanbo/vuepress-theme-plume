---
name: vuepress-plume-markdown
description: Help users write markdown files with VuePress Plume theme extensions, including containers, charts, embeds, code features, and all markdown enhancements. Invoke when user writes markdown content or asks about Plume's markdown syntax.
---

# VuePress Plume Markdown Skill

This skill provides assistance with VuePress Plume markdown extensions, charts, embeds, and code features.
It helps users write rich content using the features provided by the theme.

## When to Invoke

- Writing content in Markdown files
- Using advanced features like containers, code groups, or diagrams
- Embedding media or external content
- Configuring code block features (highlight, focus, diff, etc.)
- Using markdown enhancement syntax

## Documentation Sources

- [Markdown Extensions](https://theme-plume.vuejs.press/guide/markdown/extensions/)
- [Markdown Basic](https://theme-plume.vuejs.press/guide/markdown/basic/)
- [Code Features](https://theme-plume.vuejs.press/guide/code/features/)
- [Code Intro](https://theme-plume.vuejs.press/guide/code/intro/)

## Markdown Extensions

### Containers

- [Abbreviation](resources/abbreviation.md) - Define abbreviations with tooltips
- [Annotation](resources/annotation.md) - Add inline annotations
- [Attributes](resources/attrs.md) - Add custom attributes to elements
- [Card](resources/card.md) - Create card-style layouts
- [Chat](resources/chat.md) - Simulate chat conversations
- [Code Tree](resources/code-tree.md) - Display file trees alongside code blocks
- [Collapse](resources/collapse.md) - Create collapsible details/summary blocks
- [Container](resources/container.md) - Custom containers (info, tip, warning, etc.)
- [Demo Wrapper](resources/demo-wrapper.md) - Demo container for examples
- [Field](resources/field.md) - Field/attribute display container
- [File Tree](resources/file-tree.md) - Display file directory structures
- [Flex](resources/flex.md) - Create flexible column layouts
- [GitHub Alerts](resources/github-alerts.md) - Use GitHub-style alerts
- [Icons](resources/icons.md) - Embed icons from Iconify
- [Include](resources/include.md) - Include content from other files
- [Mark](resources/mark.md) - Highlight text with ==mark== syntax
- [Math](resources/math.md) - Render mathematical formulas using KaTeX
- [NPM To](resources/npm-to.md) - Switch between npm, yarn, pnpm, etc.
- [QR Code](resources/qrcode.md) - Generate QR codes
- [Steps](resources/steps.md) - Create step-by-step guides
- [Table](resources/table.md) - Enhanced table containers
- [Tabs](resources/tabs.md) - Create tabbed content
- [Timeline](resources/timeline.md) - Create timelines

### Charts

- [Chart.js](resources/chart.md) - Embed Chart.js charts
- [ECharts](resources/echarts.md) - Embed ECharts visualizations
- [Flowchart](resources/flowchart.md) - Create flowcharts
- [Markmap](resources/markmap.md) - Create mind maps
- [Mermaid](resources/mermaid.md) - Create diagrams using Mermaid
- [PlantUML](resources/plantuml.md) - Create UML diagrams

### Embeds

- [AcFun Video](resources/acfun.md) - Embed AcFun videos
- [ArtPlayer](resources/artplayer.md) - Embed custom videos with ArtPlayer
- [Audio Reader](resources/audio-reader.md) - Embed audio clips/pronunciation guides
- [Bilibili Video](resources/bilibili.md) - Embed Bilibili videos
- [CodePen](resources/codepen.md) - Embed CodePen demos
- [CodeSandbox](resources/codesandbox.md) - Embed CodeSandbox projects
- [JSFiddle](resources/jsfiddle.md) - Embed JSFiddle demos
- [PDF Reader](resources/pdf.md) - Embed PDF files
- [Replit](resources/replit.md) - Embed Replit projects
- [YouTube Video](resources/youtube.md) - Embed YouTube videos

### Code Features

See [resources/code-features.md](resources/code-features.md) for detailed code block features:

- **Line Numbers** - `:line-numbers`, `:no-line-numbers`, `:line-numbers=2`
- **Line Highlighting** - `{1,3,5-7}` or `// [!code highlight]`
- **Line Focus** - `// [!code focus]` or `// [!code focus:3]`
- **Diff Highlighting** - `// [!code ++]` and `// [!code --]`
- **Warning/Error** - `// [!code warning]` and `// [!code error]`
- **Word Highlight** - `// [!code word:keyword]` or `// [!code word:keyword:2]`
- **Whitespace** - `:whitespace` to show tabs/spaces
- **Collapsed Lines** - `:collapsed-lines` or `:collapsed-lines=10`
- **Code Title** - `title="filename.ext"` after language

## Enabling Features

Most markdown extensions need to be enabled in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // Containers
      hint: true, // Info, tip, warning, caution containers
      alert: true, // GitHub-style alerts

      // Code
      codeTabs: true, // Code block tabs
      tabs: true, // General tabs

      // Content
      annotation: true, // Inline annotations
      abbr: true, // Abbreviations
      mark: 'eager', // Mark/highlight text

      // Layout
      fileTree: true, // File tree container
      flex: true, // Flex layout
      collapse: true, // Collapsible sections
      chat: true, // Chat dialog
      timeline: true, // Timeline

      // Embeds
      pdf: true, // PDF embed
      bilibili: true, // Bilibili video
      youtube: true, // YouTube video
      artPlayer: true, // ArtPlayer video
      audioReader: true, // Audio

      // Code demos
      codepen: true, // CodePen
      codeSandbox: true, // CodeSandbox
      jsfiddle: true, // JSFiddle
      repl: true, // REPL

      // Charts
      chartjs: true, // Chart.js
      echarts: true, // ECharts
      mermaid: true, // Mermaid
      markmap: true, // Markmap
      plantuml: true, // PlantUML
      flowchart: true, // Flowchart

      // Other
      npmTo: true, // npm/yarn/pnpm switcher
      caniuse: true, // Can I Use embed
      icon: { // Icons
        provider: 'iconify' // or 'iconfont', 'fontawesome'
      },
      plot: true, // Hidden text (spoiler)
      imageSize: true, // Auto image dimensions
    }
  })
})
```

## Standard Markdown Extensions

VuePress Plume supports these standard markdown extensions:

- **Tables** - GitHub-flavored tables
- **Task Lists** - `- [ ]` and `- [x]`
- **Footnotes** - `[^1]` and `[^1]: note`
- **Superscript** - `19^th^`
- **Subscript** - `H~2~O`
- **Custom Anchors** - `## Title {#custom-anchor}`
- **Alignment** - `::: left/center/right`
- **Table of Contents** - `[[TOC]]`

## Code Block Features

### Basic Syntax

````md
```language
code content
```
````

### With Features

````md
```ts:title="example.ts":line-numbers {2,4-6}
// [!code highlight]
const example = 'highlighted'
// [!code ++]
const added = 'new code'
// [!code --]
const removed = 'old code'
// [!code warning]
const warning = 'be careful'
// [!code error]
const error = 'something wrong'
// [!code focus]
const focused = 'focused line'
// [!code word:example]
console.log(example)
```
````

## Frontmatter

Common frontmatter for markdown files:

```md
---
title: Article Title
createTime: 2024/01/01 12:00:00
permalink: /article/unique-id/
tags:
  - tag1
  - tag2
description: Article description for SEO
---
```

### Post-specific Frontmatter

```md
---
sticky: true        # or number for ordering
article: true       # false to hide from list
draft: true         # dev only
cover: /image.jpg   # Cover image
coverStyle:
  layout: right     # left, right, odd-left, odd-right, top
  ratio: '16:9'
  width: 240
  compact: false
---
```

### Home Page Frontmatter

```md
---
pageLayout: home
config:
  - type: hero
    hero:
      name: Site Name
      tagline: Tagline
      text: Description
      actions:
        - text: Get Started
          link: /guide/
          theme: brand
  - type: features
    features:
      - title: Feature 1
        icon: icon-name
        details: Description
---
```

## References

- [VuePress Markdown](https://v2.vuepress.vuejs.org/guide/markdown.html)
- [Plume Theme Docs](https://theme-plume.vuejs.press/)
