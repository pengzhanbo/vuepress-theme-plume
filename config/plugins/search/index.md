---
url: /config/plugins/search/index.md
---
## 本地搜索

### 概述

为站点添加本地搜索。

关联插件： [@vuepress-plume/plugin-search](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-search)

该插件使用 [minisearch](https://github.com/lucaong/minisearch) 进行内容搜索。

默认配置：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: {
      provider: 'local', // [!code hl]
      // more options...
    },
    // 也可以通过 plugins.search 配置，但不推荐
    plugins: {
      search: {},
    }
  })
})
```

### 配置

```ts
interface SearchOptions {
  /**
   * 本地搜索 国际化
   */
  locales?: {
    [locale: string]: SearchBoxLocale
  }

  /**
   * 文章是否可被搜索，默认为 `() => true`
   */
  isSearchable?: (page: Page) => boolean
}

interface SearchBoxLocale {
  placeholder: string
  buttonText: string
  resetButtonTitle: string
  backButtonTitle: string
  noResultsText: string
  footer: {
    selectText: string
    selectKeyAriaLabel: string
    navigateText: string
    navigateUpKeyAriaLabel: string
    navigateDownKeyAriaLabel: string
    closeText: string
    closeKeyAriaLabel: string
  }
}
```

## Algolia DocSearch

### 概述

使用 [Algolia DocSearch](https://docsearch.algolia.com/) 提供支持的网站内容搜索插件

关联插件：[@vuepress/plugin-docsearch](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html)

查看 [Algolia DocSearch 参考](/guide/features/content-search/#algolia-docsearch) 获取更多信息。

### 启用

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: {
      provider: 'algolia', // [!code hl]
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      // more options
    },
    // 也可以通过 plugins.docsearch 配置，但不推荐
    plugins: {
      docsearch: {},
    }
  })
})
```
