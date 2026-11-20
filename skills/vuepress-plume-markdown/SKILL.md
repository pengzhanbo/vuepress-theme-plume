---
name: vuepress-plume-markdown
description: Writes Markdown content for the VuePress Plume theme (1.0.0-rc.218+). Should be used when authoring or editing `.md` pages — containers (hint, details, tabs, steps, timeline, chat, collapse, field, card, window, table, file-tree, code-tree, demo), inline syntax (mark, icons, plot, annotation, abbr, math, emoji, obsidian wiki-links/callouts), embeds (bilibili, youtube, acfun, artplayer, audio, pdf, codepen, codesandbox, jsfiddle, repl), charts (mermaid, echarts, chart.js, markmap, plantuml, flowchart), code block features, page frontmatter, and Plume Vue components.
---

# VuePress Plume Markdown

Author Markdown for `vuepress-theme-plume@1.0.0-rc.218`. All syntax below matches the current theme — do not
invent variants, and check `resources/` before answering syntax questions.

## When to Invoke

- Writing/editing any page content: articles, docs, README home page, friend-links page.
- Answering "how do I write X in Plume" (containers, embeds, charts, code blocks, icons, math…).
- Adding page frontmatter (title, tags, cover, sticky, series, home layout…).

## Enabling Features

Theme features are gated by `theme.markdown` (in `plumeTheme()`, **not** VuePress's `markdown` config).
For config work use the `vuepress-plume-config` skill.

**On by default** — use directly, no config needed:
`hint` containers, `alert` (GitHub alerts), `::: details`, `::: tabs`, `::: code-tabs`, `::: steps`,
`::: card` / `::: card-grid`, `::: window`, `::: flex`, `::: left|center|right|justify`, `fileTree`, `plot` (`!!x!!`),
`icon` (`::name::`, provider iconify), `math` (KaTeX), `include` (`<!-- @include: -->`), `mark` (`==x==`),
emoji (`:tada:`), attributes (`{.cls}`), obsidian compatibility (wiki links, embeds, callouts, `%%comments%%`).

**Off by default** — enable before documenting:

```ts
theme: plumeTheme({
  markdown: {
    annotation: true,           // [+label] + [+label]: note
    abbr: true,                 // *[HTML]: HyperText Markup Language
    encrypt: true,              // ::: encrypt password="..."  (or { password: '123456' })
    codeTree: true,             // ::: code-tree / @[code-tree](dir)
    npmTo: true,                // ::: npm-to
    field: true,                // ::: field-group / ::: field
    table: true,                // ::: table  (enhanced table + highlight)
    timeline: true,             // ::: timeline
    collapse: true,             // ::: collapse
    chat: true,                 // ::: chat
    demo: true,                 // ::: demo / @[demo](file)
    qrcode: true,               // @[qrcode](text) / ::: qrcode
    repl: true,                 // :::rust-repl / go-repl / kotlin-repl / python-repl
    pdf: true, bilibili: true, youtube: true, acfun: true,
    artPlayer: true, audioReader: true,
    codepen: true, codeSandbox: true, jsfiddle: true,
    caniuse: true, imageSize: true, obsidian: { ... },
    chartjs: true, echarts: true, mermaid: true, markmap: true, plantuml: true, flowchart: true,
  },
})
```

`markdown.obsidian` is enabled unless explicitly `false`; its sub-switches are `wikiLink`, `embedLink`,
`callout`, `comment` (all `true`). ECharts/Chart.js scripts **do not execute** unless
`markdown.DANGEROUS_ALLOW_SCRIPT_EXECUTION: true` (plus an allowlist) is set — see `resources/echarts.md`.

## Syntax Conventions

| Rule | Detail |
| --- | --- |
| Code fence meta | ` ```ts title="a.ts" :line-numbers :collapsed-lines=10 {2,4}` — `title=`, `:flags` and `{lines}` can be in any order |
| Nested containers | The outer marker needs **more colons** than the inner one: `:::: tabs` … `::: hint` … `:::` … `::::` |
| List-based containers | `timeline`, `collapse`, `steps`, `chat`, `field` need a **blank line** between the item title and its body |
| Attributes | Inline: attach directly (`**bold**{.red}`). List item: on the **next line, no blank line**. Table: **after a blank line** |
| Icons | `::mdi:home::`, `::mdi:home =24 /#f00::` (two colons each side) |
| Mark | `==text==`, requires a space around the delimiters in CJK text |

## Feature Index

### Layout & containers

| Feature | Resource |
| --- | --- |
| Hint / details containers, alignment (`::: left`) | `resources/container.md` |
| GitHub alerts (`> [!NOTE]`) | `resources/github-alerts.md` |
| Tabs & code tabs (`::: tabs`, `::: code-tabs`) | `resources/tabs.md` |
| Steps | `resources/steps.md` |
| Timeline | `resources/timeline.md` |
| Collapse panels | `resources/collapse.md` |
| Chat dialog | `resources/chat.md` |
| Field / API docs | `resources/field.md` |
| Card & card-grid | `resources/card.md` |
| Window frame | `resources/window.md` |
| Flexbox row | `resources/flex.md` |
| Enhanced table + cell merge | `resources/table.md` |
| File tree / code tree | `resources/file-tree.md`, `resources/code-tree.md` |
| Live demo | `resources/demo.md` |
| Encrypted snippet | `resources/encrypt-snippet.md` |
| QR code | `resources/qrcode.md` |
| Browser REPL (rust/go/kotlin/python) | `resources/repl.md` |

### Inline & text

| Feature | Resource |
| --- | --- |
| Highlight `==text==` | `resources/mark.md` |
| Icons `::name::` | `resources/icons.md` |
| Hidden text `!!text!!` | `resources/plot.md` |
| Annotations `[+label]` | `resources/annotation.md` |
| Abbreviations | `resources/abbreviation.md` |
| Attributes `{.class}` | `resources/attrs.md` |
| Math | `resources/math.md` |
| Emoji | `resources/emoji.md` |
| Environment presets (`markdown.env`) | `resources/env.md` |
| Include files | `resources/include.md` |
| npm → pnpm/yarn/bun/deno | `resources/npm-to.md` |
| Obsidian syntax (wiki links, embeds, callouts) | `resources/obsidian.md` |
| `<llm-only>` / `<llm-exclude>` | `resources/llmstxt.md` |

### Embeds

`resources/acfun.md`, `resources/bilibili.md`, `resources/youtube.md`, `resources/artplayer.md`,
`resources/audio-reader.md`, `resources/pdf.md`, `resources/codepen.md`, `resources/codesandbox.md`,
`resources/jsfiddle.md`, `resources/repl.md`

### Charts

`resources/mermaid.md`, `resources/echarts.md`, `resources/chart.md` (Chart.js), `resources/markmap.md`,
`resources/plantuml.md`, `resources/flowchart.md`

### Code blocks

`resources/code-features.md` — title, line numbers, highlight, focus, diff, warning/error, word highlight,
whitespace, collapsed lines, `@[code]` import, twoslash.

### Pages & components

| Topic | Resource |
| --- | --- |
| Article frontmatter (post) | `resources/frontmatter.md` |
| Home page (`pageLayout: home`) | `resources/home-page.md` |
| Friend links page | `resources/friend-links.md` |
| Vue components (Card, Badge, Icon, Swiper, RepoCard, NpmBadge, ImageCard, LinkCard, CardGrid, CardMasonry, HomeBox) | `resources/components.md` |

## Article Skeleton

```md
---
title: Article Title
createTime: 2024/01/01 12:00:00
tags: [vue, vuepress]
cover: /images/cover.png
sticky: 1
series: vue3-in-depth
seriesOrder: 2
---

## Section

Content …

<!-- more -->
```

`title`, `createTime` and `permalink` are auto-filled by `autoFrontmatter`; only write `permalink` when a
stable URL is required.

## Pitfalls

- `@tab` must be the first thing on its line (no indentation); blank lines inside a tab body are fine.
- `::: table` uses **named** attributes (`title="..."`), not positional text; the title renders **below** the table.
- `::: qrcode` / `::: demo` / `::: code-tree` take key=value attributes, not positional titles.
- `::: field` requires `markdown.field: true`; `timeline`/`collapse`/`steps`/`chat`/`table` each need their switch.
- Inside encrypted snippets (`::: encrypt`), only static HTML: no Vue components or template syntax.
- Chart scripts are inert by default — say so instead of promising interactivity.
- `@[replit]` is deprecated and Replit shut the service down; prefer CodeSandbox/JSFiddle or `:::*-repl`.

## Documentation

- <https://theme-plume.vuejs.press/guide/markdown/basic/>
- <https://theme-plume.vuejs.press/guide/code/features/>
- <https://theme-plume.vuejs.press/guide/components/card/>
- <https://theme-plume.vuejs.press/config/markdown/>
