---
title: Internationalization
icon: material-symbols-light:language
createTime: 2025/03/04 13:12:03
permalink: /en/guide/international/
tags:
  - Guide
  - i18n
---

Implementing ==internationalization== in the theme only requires some simple configurations.

Let's take an example of creating a project with **Chinese** as the default language and including **English** and **French**.

## Directory Structure

First, you need to create a directory structure similar to the following:

::: file-tree

- docs
  - **en**  \# English directory
    - foo.md
    - README.md  \# English home page
  - **fr**  \# French directory
    - foo.md
    - README.md  \# French home page
  - foo.md
  - README.md  \# Chinese home page
:::

Here, `docs/en/` is used to store **English** documents, `docs/fr/` stores **French** documents, and **Chinese** documents are stored directly under `docs/`.

::: important Consistent directory and file names across languages
Try to keep the file names and directory names consistent across different language directories. This helps the theme correctly navigate to different language versions of the article when switching languages.
:::

## VuePress Configuration

### Default Language

In `.vuepress/config.ts`, declare the default language:

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // Declare the default language
  lang: 'zh-CN', // [!code ++]
  // Locales supported under multilingual
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // Default language is Simplified Chinese
  }
})
```

:::

### Adding Other Languages

You need to set the `lang` option for each language. Even if you are only using a single language, you must set `lang` in `.vuepress/config.{js,ts}`.

::: tip Why do this?
To provide the correct locale text, the theme needs to know which language is being used in the root folder and each multilingual folder.
:::

Configure in `.vuepress/config.ts`:

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // Declare the default language
  lang: 'zh-CN',
  // Locales supported under multilingual
  locales: {
    // Configure languages under different paths
    '/': { lang: 'zh-CN', title: '博客' }, // Default language is Simplified Chinese
    '/en/': { lang: 'en-US', title: 'Blog' }, // English // [!code ++]
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // French // [!code ++]
  }
})
```

:::

The `key` in the `locales` configuration acts as the `localePath`, corresponding to the language path under the `docs` directory, and should have the same naming.

At the same time, the `key` (`localePath`) will also serve as the prefix for the page access links of different languages.

::: important Language codes
The `key` in the `locales` configuration, i.e., `localePath`, must comply with the [ISO 639](https://zh.wikipedia.org/wiki/ISO_639-1) standard. For non-default languages, such as **English**, it should be `/en/`.

In `locales[localePath]`, `lang` is the **language code** for the current language. Please use the standard [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code. For example, **English** should be `en-US` (indicating English (United States)).
:::

## Theme Configuration

In the theme configuration, the `locales` configuration item is also used for multilingual configuration.

`locales` supports all theme configuration items.

::: code-tabs
@tab .vuepress/config.ts

```js
import { plumeTheme } from '@vuepress-plume/vuepress-theme-plume'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // Default language is Simplified Chinese
    '/en/': { lang: 'en-US', title: 'Blog' }, // English
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // French
  },
  theme: plumeTheme({
    // Multilingual configuration within the theme
    locales: {
      '/': { // [!code hl]
        // The text displayed in the navigation bar language dropdown menu for the current language
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

:::

The `key` in the theme `theme.locales` configuration should be consistent with the `key` in the `locales` configuration of `vuepress`.

You should configure `selectLanguageName` for `theme.locales[localePath]` to display the name of the current language in the navigation bar language dropdown menu.

For more `locales` configuration, please refer to

- [Theme Configuration > Locales Configuration](../../config/basic.md#locales-configuration) - Configure the behavior of the theme under different languages.
- [Theme Configuration > Multilingual Configuration](../../config/locales.md) - Configure text related to languages.
