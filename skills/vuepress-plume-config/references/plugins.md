# Built-in Plugins Reference

`plugins` configures the plugins the theme wires up internally. It is **not** the same as VuePress's
`plugins` field, and it is **not** hot-reloadable (declare it inside `plumeTheme()`).

| Key | Plugin | Default | Notes |
| --- | --- | --- | --- |
| `search` | `@vuepress-plume/plugin-search` | enabled (local) | prefer top-level `search` |
| `docsearch` | `@vuepress/plugin-docsearch` | off | prefer top-level `search.provider: 'algolia'` |
| `copyCode` | `@vuepress/plugin-copy-code` | enabled | prefer top-level `copyCode` |
| `shiki` | `@vuepress/plugin-shiki` | enabled | prefer top-level `codeHighlighter` |
| `git` | `@vuepress/plugin-git` | `NODE_ENV === 'production'` | boolean only |
| `nprogress` | `@vuepress/plugin-nprogress` | enabled | `nprogress: false` disables |
| `photoSwipe` | `@vuepress/plugin-photo-swipe` | enabled | image preview |
| `markdownPower` | `vuepress-plugin-md-power` | enabled | prefer top-level `markdown` |
| `markdownImage` | `@vuepress/plugin-markdown-image` | `false` | top-level `markdown.image` |
| `markdownMath` | `@vuepress/plugin-markdown-math` | `{ type: 'katex' }` | top-level `markdown.math` |
| `markdownInclude` | `@vuepress/plugin-markdown-include` | `true` | top-level `markdown.include` |
| `markdownChart` | `@vuepress/plugin-markdown-chart` | `false` | top-level `markdown.chartjs/echarts/...` |
| `comment` | `@vuepress/plugin-comment` | `false` | prefer top-level `comment` |
| `sitemap` | `@vuepress/plugin-sitemap` | enabled (needs `hostname`) | `false` disables |
| `seo` | `@vuepress/plugin-seo` | enabled (needs `hostname`) | `false` disables |
| `cache` | `@vuepress/plugin-cache` | `'filesystem'` | prefer top-level `cache` |
| `readingTime` | `@vuepress/plugin-reading-time` | enabled | prefer top-level `readingTime` |
| `watermark` | `@vuepress/plugin-watermark` | off | prefer top-level `watermark` |
| `replaceAssets` | `@vuepress/plugin-replace-assets` | off | prefer top-level `replaceAssets` |
| `llmstxt` | `@vuepress/plugin-llms` | off | prefer top-level `llmstxt` |
| ~~`markdownEnhance`~~ | deprecated (`never`) | — | use `markdown` |

`hostname` is normally read from the theme option; `plugins.seo.hostname` / `plugins.sitemap.hostname` only exist
as an escape hatch.

## Precedence

1. Top-level theme option (`search`, `comment`, `watermark`, `markdown`, `codeHighlighter`, `readingTime`,
   `copyCode`, `replaceAssets`, `llmstxt`, `cache`) — hot reloadable.
2. `plugins.<key>` — merged underneath the top-level option.
3. Theme defaults.

Because of (2), configuring both places is redundant; configure the top-level option.

## Common snippets

```ts
// enable git data in dev so contributors/changelog work locally
plugins: { git: true }

// Algolia via plugin layer (no hot reload)
plugins: { docsearch: { appId: '...', apiKey: '...', indexName: '...' } }

// turn off a built-in plugin
plugins: { photoSwipe: false, nprogress: false }
```

## Peer / optional dependencies

Optional peers are never hard dependencies — the theme warns when a feature is enabled without them:

| Feature | Package |
| --- | --- |
| `Swiper` component | `swiper` |
| `@[artPlayer]` | `artplayer` (+ `dashjs`, `hls.js`, `mpegts.js` per format) |
| chart effects / hero effects | `three`, `ogl`, `gsap`, `postprocessing` |
| pinyin-based sorting helpers | `pinyin-pro` |
| `math: { type: 'mathjax' }` | `@mathjax/src` |
| icon collections | `@iconify/json` |
| Waline comments | `@waline/client` |
