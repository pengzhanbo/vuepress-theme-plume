---
url: /guide/sitemap/index.md
---
## 概述

主题提供了开箱即用的配置，为站点生成 `sitemap.xml` 文件，帮助搜索引擎收录你的页面。

## 使用

要启用它，需要进行以下配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://your-site.com',
  })
})
```

如需要自定义 sitemap，可以通过 `plugins.sitemap` 配置来实现。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      sitemap: {
        // ... sitemap 配置
      }
    }
  })
})
```

完整配置请查看 [文档](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/config.html)

## 限制

::: warning `hostname` 必须配置
`hostname` 是 sitemap 生成的**必要条件**。未配置时主题会跳过 sitemap 生成 —— 你会得到一个「配置了却没生效」的结果。

多语言站点请填写**主站**地址，语言前缀由主题自动补全。
:::

::: warning 仅在生产构建时生效
**开发模式（`vuepress dev`）下不会生成 sitemap**。请在 `pnpm docs:build` 之后检查 `dist/sitemap.xml`。
:::

::: tip `hostname` 同时影响 SEO
主题的 SEO 插件与 sitemap 共用同一个 `hostname`。若同时启用了 SEO 与 sitemap，配置一次即可。
:::
