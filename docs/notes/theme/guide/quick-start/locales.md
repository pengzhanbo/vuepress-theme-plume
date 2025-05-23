---
title: 国际化
icon: material-symbols-light:language
createTime: 2024/03/05 10:01:26
permalink: /guide/locales/
tags:
  - 指南
  - i18n
---

在主题内实现 ==国际化== 只需要进行一些简单的配置。

举一个例子，创建一个 默认语言为 **中文**，并包含 **英语** 和 **法语** 的项目。

## 目录

首先，需要创建类似于下面的目录结构：

::: file-tree

- docs
  - **en**  \# 英文目录
    - foo.md
    - README.md  \# 英文首页
  - **fr**  \# 法文目录
    - foo.md
    - README.md  \# 法文首页
  - foo.md
  - README.md  \# 中文首页
:::

其中，`docs/en/` 用于保存 **英文** 文档，`docs/fr/` 保存 **法文** 文档，而 **中文** 则直接保存在 `docs/` 下。

::: important 不同语言下的目录结构与文件名保持一致
在不同的语言目录下，请尽量保持文件名和目录名的一致。这有助于在 切换语言时，主题能够正确的导航到 文章
的不同的语言版本。
:::

## vuepress 配置

### 默认语言

在 `.vuepress/config.ts` 中，声明默认的语言：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // 声明默认的语言
  lang: 'zh-CN', // [!code ++]
  // 多语言下支持的各种语言 locales
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // 默认语言 为 简体中文
  }
})
```

### 添加其他语言

你需要为每个语言设置 `lang` 选项。即使你只在使用单个语言，你也必须在 `.vuepress/config.{js,ts}` 中设置 `lang`。

::: tip 为什么要这样做?
要提供正确的语言环境文本，主题需要知道根文件夹以及每个多语言文件夹正在使用哪种语言。
:::

在 `.vuepress/config.ts` 中配置：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // 声明默认的语言
  lang: 'zh-CN',
  // 多语言下支持的各种语言 locales
  locales: {
    // 配置 不同 path 下的语言
    '/': { lang: 'zh-CN', title: '博客' }, // 默认语言 为 简体中文
    '/en/': { lang: 'en-US', title: 'Blog' }, // 英文 // [!code ++]
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // 法语 // [!code ++]
  }
})
```

**`locales` 配置中的 `key` 作为 `localPath`, 对应着 `docs` 目录下的语言路径，应该保证它们具有相同的命名。**

**同时，`key` (`localPath`) 也将作为 不同语言的页面访问链接的前缀。**

::: important 语言代码
`locales` 配置中的 `key` 即 `localePath` 需要符合 [ISO 639](https://zh.wikipedia.org/wiki/ISO_639-1) 规范，
对于非默认语言的，如 `英语` 应该为 `/en/`。

在 `locales[localePath]` 中， `lang` 为当前语言的 **语言代码**，请使用标准的 [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) 语言代码。如， `英语` 应该为 `en-US`，（表示英语（美国））。
:::

## 主题配置

在主题配置中，同样使用 `locales` 配置项进行多语言配置。

`locales` 支持 所有主题配置项。

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // 默认语言 为 简体中文
    '/en/': { lang: 'en-US', title: 'Blog' }, // 英文
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // 法语
  },
  theme: plumeTheme({
    // 主题内的多语言配置
    locales: {
      '/': { // [!code hl]
        // 当前语言显示在导航栏多语言下拉菜单的文本
        selectLanguageName: '简体中文',
        navbar: [
          { text: '首页', link: '/' },
          { text: '博客', link: '/blog/' },
        ]
      },
      '/en/': { // [!code hl]
        selectLanguageName: 'English',
        navbar: [
          { text: 'Home', link: '/en/' },
          { text: 'Blog', link: '/en/blog/' },
        ]
      },
      '/fr/': { // [!code hl]
        selectLanguageName: 'Français',
        navbar: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Le Blog', link: '/fr/blog/' },
        ]
      }
    }
  })
})
```

主题 `theme.locales` 配置中的 `key` 应与 `vuepress` 配置中的 `locales` 配置中的 `key` 一致。

您应该为 `theme.locales[localePath]` 配置 `selectLanguageName` 用于在导航栏多语言下拉菜单中显示当前语言的名称。

更多 `locales` 配置请查看

- [主题配置 > Locales 配置](../../config/theme.md#locale-配置) - 配置主题在不同语言下的行为。
- [主题配置 > 多语言配置](../../config/locales.md) - 配置与语言相关的文本。
