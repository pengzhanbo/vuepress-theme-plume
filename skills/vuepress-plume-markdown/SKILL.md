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

## Enabling Features

Most markdown extensions need to be enabled in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // Containers
      hint: true, // Info, tip, warning, caution containers (default: true)
      alert: true, // GitHub-style alerts (default: true)

      // Code
      codeTabs: true, // Code block tabs (default: true)
      tabs: true, // General tabs (default: true)

      // Content
      annotation: false, // Inline annotations
      abbr: false, // Abbreviations
      mark: 'eager', // Mark/highlight text (default: 'eager')

      // Layout
      fileTree: true, // File tree container (default: true)
      flex: false, // Flex layout
      collapse: false, // Collapsible sections
      chat: false, // Chat dialog
      timeline: false, // Timeline
      field: false, // Field container
      table: false, // Enhanced table container
      demo: false, // Demo container

      // Embeds
      pdf: false, // PDF embed
      bilibili: false, // Bilibili video
      youtube: false, // YouTube video
      artPlayer: false, // ArtPlayer video
      audioReader: false, // Audio

      // Code demos
      codepen: false, // CodePen
      codeSandbox: false, // CodeSandbox
      jsfiddle: false, // JSFiddle
      repl: false, // REPL

      // Charts
      chartjs: false, // Chart.js
      echarts: false, // ECharts
      mermaid: false, // Mermaid
      markmap: false, // Markmap
      plantuml: false, // PlantUML
      flowchart: false, // Flowchart

      // Other
      npmTo: false, // npm/yarn/pnpm switcher
      caniuse: false, // Can I Use embed
      icon: { provider: 'iconify' }, // Icons (default: iconify)
      plot: true, // Hidden text (spoiler) (default: true)
      imageSize: false, // Auto image dimensions
      include: true, // Include markdown files (default: true)
      math: { type: 'katex' }, // Math formulas (default: katex)
    },
  }),
})
```

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

- **Code Title** - `title="filename.ext"` after language
- **Line Numbers** - `:line-numbers`, `:no-line-numbers`, `:line-numbers=2`
- **Line Highlighting** - `{1,3,5-7}` or `// [!code highlight]`
- **Line Focus** - `// [!code focus]` or `// [!code focus:3]`
- **Diff Highlighting** - `// [!code ++]` and `// [!code --]`
- **Warning/Error** - `// [!code warning]` and `// [!code error]`
- **Word Highlight** - `// [!code word:keyword]` or `// [!code word:keyword:2]`
- **Whitespace** - `:whitespace` to show tabs/spaces
- **Collapsed Lines** - `:collapsed-lines` or `:collapsed-lines=10`

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
```ts title="example.ts":line-numbers {2,4-6}
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

### Language-Specific Comments

Different languages use different comment syntax:

| Language | Highlight | Focus | Diff Add | Diff Remove |
|----------|-----------|-------|----------|-------------|
| JS/TS/JSX/TSX | `// [!code highlight]` | `// [!code focus]` | `// [!code ++]` | `// [!code --]` |
| Python/Ruby/YAML | `# [!code highlight]` | `# [!code focus]` | `# [!code ++]` | `# [!code --]` |
| CSS/SCSS | `/* [!code highlight] */` | `/* [!code focus] */` | `/* [!code ++] */` | `/* [!code --] */` |
| HTML/XML | `<!-- [!code highlight] -->` | `<!-- [!code focus] -->` | `<!-- [!code ++] -->` | `<!-- [!code --] -->` |
| Bash/Shell | `# [!code highlight]` | `# [!code focus]` | `# [!code ++]` | `# [!code --]` |
| SQL | `-- [!code highlight]` | `-- [!code focus]` | `-- [!code ++]` | `-- [!code --]` |

### Global Configuration

Enable features globally in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // Enable line numbers globally
      whitespace: false, // Show whitespace globally
      collapsedLines: false, // Collapse lines globally
      theme: { light: 'github-light', dark: 'github-dark' },
      twoslash: false, // TypeScript twoslash
    },
  }),
})
```

When enabled globally, use `:no-line-numbers`, `:no-whitespace`, `:no-collapsed-lines` to disable per block.

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
    full: true
    effect: hyper-speed
    forceDark: true
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
  - type: image-text
    title: Section Title
    image: /images/feature.svg
    list:
      - title: Item 1
        description: Description
  - type: text-image
    title: Section Title
    image: /images/feature.svg
    list:
      - title: Item 1
        description: Description
  - type: custom
---
```

## LLMs txt Markup

When `llmstxt` is enabled, you can use special markup:

### `<llm-only>` - Content visible only to LLMs
```md
<llm-only>

## Section for LLMs

This content only appears in LLM-generated files.

</llm-only>
```

### `<llm-exclude>` - Content hidden from LLMs
```md
<llm-exclude>

## Section for humans

This content will not appear in LLM files.

</llm-exclude>
```

## Components

### Swiper (Carousel)

Requires installing `swiper`:

```bash
npm install swiper
```

```md
<script setup>
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
</script>

<Swiper :items="['img1.jpg', 'img2.jpg']" />
```

Props: `items`, `width`, `height`, `mode` ('banner'|'carousel'|'broadcast'), `navigation`, `effect`, `delay`, `speed`, `loop`, `pauseOnMouseEnter`, `swipe`

## References

- [VuePress Markdown](https://v2.vuepress.vuejs.org/guide/markdown.html)
- [Plume Theme Docs](https://theme-plume.vuejs.press/)
- [Markdown Configuration](https://theme-plume.vuejs.press/config/markdown/)
