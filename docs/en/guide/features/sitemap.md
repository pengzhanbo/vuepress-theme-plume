---
title: sitemap
icon: mdi:sitemap-outline
createTime: 2025/10/08 16:47:00
permalink: /en/guide/sitemap/
---

## Usage

The theme provides out-of-the-box configuration to generate a `sitemap.xml` file for the site.
To enable it, the following configuration is required:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://your-site.com',
  })
})
```

If customization of the sitemap is needed, it can be achieved through the `plugins.sitemap` configuration.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      sitemap: {
        // ... sitemap configurations
      }
    }
  })
})
```

Refer to the [documentation](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/config.html) for the complete configuration.

## Limitations

::: warning `hostname` is required
`hostname` is a **prerequisite** for sitemap generation. Without it the theme silently skips generating
the sitemap, leaving you with a config that appears to work but
does nothing.

For multi-language sites, provide the **main site** address; language prefixes are added automatically.
:::

::: warning Production builds only
The sitemap is **not generated in dev mode** (`vuepress dev`) . Check `dist/sitemap.xml` after `pnpm docs:build` instead.
:::

::: tip `hostname` also affects SEO
The SEO plugin shares the same `hostname` as the sitemap. Configure it once if you enable both.
:::
