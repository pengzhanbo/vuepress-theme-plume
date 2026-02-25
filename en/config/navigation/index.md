---
url: /en/config/navigation/index.md
---
## Overview

::: tip Navbar configuration can be set in either `.vuepress/config.ts` or `plume.config.ts`.
:::

The theme automatically generates the simplest navbar configuration by default, including only the **Home** and **Blog List** pages.

You can also configure the navbar yourself to override the default configuration.

The default configuration is as follows:

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Tags', link: '/blog/tags/' },
      { text: 'Archives', link: '/blog/archives/' }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  navbar: [
    { text: 'Home', link: '/' },
    { text: 'Blog', link: '/blog/' },
    { text: 'Tags', link: '/blog/tags/' },
    { text: 'Archives', link: '/blog/archives/' }
  ]
})
```

:::

When multi-language configuration is enabled, the default navbar configuration for the corresponding languages will be generated:

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // Simplified Chinese
    '/en/': { lang: 'en-US', title: 'Blog' }, // English
  },
  theme: plumeTheme({
    locales: {
      '/': {
        navbar: [
          { text: '首页', link: '/' },
          { text: '博客', link: '/blog/' },
          { text: '标签', link: '/blog/tags/' },
          { text: '归档', link: '/blog/archives/' }
        ]
      },
      '/en/': {
        navbar: [
          { text: 'Home', link: '/en/' },
          { text: 'Blog', link: '/en/blog/' },
          { text: 'Tags', link: '/en/blog/tags/' },
          { text: 'Archives', link: '/en/blog/archives/' }
        ]
      }
    }
  })
})
```

As your site content becomes richer, for example, when configuring collections for blog, notes, documentation,
friend links, external links, etc., the default generated navbar configuration may no longer meet your needs.

At this point, you can fully customize the navbar using the `navbar` field, which will directly override the default navbar configuration.

## Configuration

Type: `NavItem[]`

```ts
interface ThemeBadge {
  /* Badge text */
  text?: string
  /* Badge type, built-in: 'info' | 'tip' | 'danger' | 'warning' */
  type?: string
  /* Text color */
  color?: string
  /* Background color */
  bgColor?: string
  /* Border color */
  borderColor?: string
}

type NavItem = string | {
  /**
   * Navbar text
   */
  text: string
  /**
   * Navbar link
   * - Can be an external link
   * - Can be a permalink from frontmatter
   * - Can be a relative path to a markdown file (relative to `sourceDir`), must start with `/`
   */
  link: string
  /**
   * Icon name, or SVG icon
   */
  icon?: string | { svg: string }

  /**
   * Badge, supports custom badge styles
   */
  badge?: string | ThemeBadge
  /**
   * Controls when the element is activated
   */
  activeMatch?: string
  /**
   * Prefix for the current group of page links
   */
  prefix?: string
  /**
   * Nested navbar items, maximum depth is 2
   */
  items?: NavItem[]
}
```

### Nested Configuration Example

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    navbar: [
      { text: 'Home', link: '/', icon: 'material-symbols:home-outline' },
      { text: 'Blog', link: '/blog/', icon: 'material-symbols:article-outline' },
      {
        text: 'Technical Docs',
        icon: 'mdi:idea',
        items: [
          {
            text: 'Vuepress Theme',
            icon: 'icon-park-solid:theme',
            items: [
              {
                text: 'vuepress-theme-plume',
                link: '/vuepress-theme-plume/',
                icon: 'mdi:paper-airplane',
                badge: 'Badge'
              },
            ],
          },
          {
            text: 'Vuepress Plugin',
            icon: 'mingcute:plugin-2-fill',
            badge: { text: 'Badge', type: 'warning' },
            items: [
              {
                text: 'caniuse',
                link: '/vuepress-plugin/caniuse/',
                icon: 'pajamas:feature-flag',
              },
              {
                text: 'auto-frontmatter',
                link: '/vuepress-plugin/auto-frontmatter/',
                icon: 'material-symbols:move-selection-down-rounded',
              },
              {
                text: 'blog-data',
                link: '/vuepress-plugin/blog-data/',
                icon: 'ic:baseline-post-add',
              },
              {
                text: 'notes-data',
                link: '/vuepress-plugin/notes-data/',
                icon: 'material-symbols:note-alt-rounded',
              },
              {
                text: 'shiki',
                link: '/vuepress-plugin/shiki/',
                icon: 'material-symbols-light:code-blocks-outline-rounded',
              },
            ],
          },
        ],
      },
    ]
  })
})
```

### `activeMatch`

`activeMatch` is used to control when the current link element is activated. Its value is a regex-like string.

**Example:** `activeMatch: '^/(blog|article)/'`

This means that for page links starting with `/blog/` or `/article/`, this link element will be activated.

### Icons

Supports icons from sources configured via [markdown -> icon](../guide/features/icon.md).

* When `markdown.icon.provide` is `iconify`, [iconify](https://iconify.design/) icons are supported
* When `markdown.icon.provide` is `iconfont`, [iconfont](https://www.iconfont.cn/) icons are supported
* When `markdown.icon.provide` is `fontawesome`, [fontawesome](https://fontawesome.com/) icons are supported

When `markdown.icon.provide` is not `iconify`, you can prefix the icon name with `iconify` to force the
use of [iconify](https://iconify.design/) icons.

```ts
const item = { text: 'Home', link: '/', icon: 'iconify carbon:home' }
```

## Configuration Helper Function

The theme provides the `defineNavbarConfig(config)` function to offer type assistance for the navbar
configuration to theme users. This facilitates separating the `navbar` configuration into an independent configuration file.

```ts title="navbar.ts" twoslash
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: 'Home', link: '/' },
  { text: 'Blog', link: '/blog/' },
  // ... more
])
```
