---
url: /config/navigation/index.md
---
## 概述

::: tip 导航栏配置支持在 `.vuepress/config.ts` ，或者在 `plume.config.ts` 中进行配置。
:::

主题默认会自动生成最简单的导航栏配置，仅包括 **首页** 和 **文章列表页** 。

你也可以自己配置导航栏，覆盖默认的的导航栏配置。

默认配置如下：

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    navbar: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '标签', link: '/blog/tags/' },
      { text: '归档', link: '/blog/archives/' }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  navbar: [
    { text: '首页', link: '/' },
    { text: '博客', link: '/blog/' },
    { text: '标签', link: '/blog/tags/' },
    { text: '归档', link: '/blog/archives/' }
  ]
})
```

:::

当开启了 多语言配置，则会生成对应语言的导航栏的默认配置：

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // 简体中文
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
          { text: '首页', link: '/en/' },
          { text: '博客', link: '/en/blog/' },
          { text: '标签', link: '/en/blog/tags/' },
          { text: '归档', link: '/en/blog/archives/' }
        ]
      }
    }
  })
})
```

随着站点内容变得越来越丰富，如通过 集合 配置了 博客、笔记、文档、友情链接、 外部链接等等，
默认生成的导航栏配置满足不了您的需求。

这时候，您可以通过 `navbar` 字段来完全自定义导航栏，它将直接覆盖默认的导航栏配置。

## 配置

类型: `NavItem[]`

```ts
interface ThemeBadge {
  /* 徽章文本 */
  text?: string
  /* 徽章类型，内置： 'info' | 'tip' | 'danger' | 'warning' */
  type?: string
  /* 文本颜色 */
  color?: string
  /* 背景颜色 */
  bgColor?: string
  /* 边框颜色 */
  borderColor?: string
}

type NavItem = string | {
  /**
   * 导航栏文本
   */
  text: string
  /**
   * 导航栏链接
   * - 可以是外部链接
   * - 可以是 frontmatter 中的 permalink
   * - 可以是相对于 `sourceDir` 的 markdown文件路径，请注意需要以 `/` 开头
   */
  link: string
  /**
   * 图标名称，或者 svg 图标
   */
  icon?: string | { svg: string }

  /**
   * 徽章，支持自定义徽章样式
   */
  badge?: string | ThemeBadge
  /**
   * 控制元素何时被激活
   */
  activeMatch?: string
  /**
   *
   * 当前分组的页面链接前缀
   */
  prefix?: string
  /**
   * 最大深度为 2，生成嵌套的导航栏
   */
  items?: NavItem[]
}
```

### 嵌套配置示例

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    navbar: [
      { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
      { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline' },
      {
        text: '技术文档',
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
                badge: '徽章'
              },
            ],
          },
          {
            text: 'Vuepress Plugin',
            icon: 'mingcute:plugin-2-fill',
            badge: { text: '徽章', type: 'warning' },
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

`activeMatch` 用于控制当前链接元素何时被激活。其值为一个类正则表达式的字符串。

**示例：** `activeMatch: '^/(blog|article)/'`

这表示，以 `/blog/` 或 `/article/` 开头的页面链接地址，该链接元素将被激活。

### 图标

支持通过 [markdown -> icon](../guide/features/icon.md) 配置的来源的图标。

* 当 `markdown.icon.provide` 为 `iconify` 时，支持 [iconify](https://iconify.design/) 图标
* 当 `markdown.icon.provide` 为 `iconfont` 时，支持 [iconfont](https://www.iconfont.cn/) 图标
* 当 `markdown.icon.provide` 为 `fontawesome` 时，支持 [fontawesome](https://fontawesome.com/) 图标

`markdown.icon.provide` 为非 `iconify` 值时，可以在 图标名称前加上 `iconify` 前缀，强制使用 [iconify](https://iconify.design/) 图标。

```ts
const item = { text: '首页', link: '/', icon: 'iconify carbon:home' }
```

## 配置帮助函数

主题提供了 `defineNavbarConfig(config)` 函数，为主题使用者提供导航栏配置的类型帮助。
便于将 `navbar` 配置分离到独立的配置文件中。

```ts title="navbar.ts" twoslash
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  // ... more
])
```
