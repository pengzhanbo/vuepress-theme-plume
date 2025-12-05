---
url: /en/config/plugins/index.md
---
The theme comes with built-in plugins that extend its numerous functionalities.
You can configure these internal plugins through the `plugins` option.

## Configuration

All plugins used internally by the theme are configured within the `plugins` field.

```js title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      // more options...  // [!code ++]
    }
  }),
})
```

## Plugin List

* [@vuepress/plugin-nprogress](https://ecosystem.vuejs.press/zh/plugins/features/nprogress.html) - Page loading progress bar
* [@vuepress/plugin-photo-swipe](https://ecosystem.vuejs.press/zh/plugins/features/photo-swipe.html) - Image preview
* [@vuepress/plugin-reading-time](https://ecosystem.vuejs.press/zh/plugins/development/reading-time.html) - Article reading time
* [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html) - Article watermark
* [@vuepress-plume/plugin-search](./search.md) - Local search
* [@vuepress/plugin-docsearch](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html) - Algolia documentation search
* [@vuepress/plugin-copy-code](https://ecosystem.vuejs.press/zh/plugins/features/copy-code.html) - Code copy
* [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html) - Syntax highlighting
* [@vuepress/plugin-comment](https://ecosystem.vuejs.press/zh/plugins/blog/comment/) - Article comments
* [@vuepress/plugin-markdown-hint](https://ecosystem.vuejs.press/zh/plugins/markdown/hint.html) - Markdown hints
* [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/image.html) - Markdown images
* [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/math.html) - Markdown mathematical formulas
* [@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/zh/plugins/markdown/include.html) - Markdown file inclusion
* [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-chart/) - Markdown charts
  chartjs / echarts / mermaid / flowchart / markmap / plantUML
* [@vuepress/plugin-replace-assets](https://ecosystem.vuejs.press/zh/plugins/tools/replace-assets.html) - Asset link replacement
* [vuepress-plugin-md-power](./markdown-power.md) - Markdown Power
* [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) - Git commit information
* [@vuepress/plugin-cache](https://ecosystem.vuejs.press/zh/plugins/tools/cache.html) - Page compilation cache
* [@vuepress/plugin-seo](https://ecosystem.vuejs.press/zh/plugins/seo/seo/) - SEO optimization
* [@vuepress/plugin-sitemap](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/) - Sitemap

:::tip
You don't need to install these built-in plugins separately, nor should you add them to [vuepress config > plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins).
The theme has already handled their integration internally.
:::
