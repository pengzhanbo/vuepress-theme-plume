---
url: /en/config/plugins/search/index.md
---
## Local Search

### Overview

Adds local search functionality to the site.

Related plugin: [@vuepress-plume/plugin-search](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-search)

This plugin uses [minisearch](https://github.com/lucaong/minisearch) for content search.

Default configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: {
      provider: 'local', // [!code hl]
      // more options...
    },
    // Can also be configured via plugins.search, but not recommended
    plugins: {
      search: {},
    }
  })
})
```

### Configuration

```ts
interface SearchOptions {
  /**
   * Local search internationalization
   */
  locales?: {
    [locale: string]: SearchBoxLocale
  }

  /**
   * Whether articles are searchable, defaults to `() => true`
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

### Overview

A site content search plugin powered by [Algolia DocSearch](https://docsearch.algolia.com/)

Related plugin: [@vuepress/plugin-docsearch](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html)

Refer to [Algolia DocSearch Reference](/guide/features/content-search/#algolia-docsearch) for more information.

### Enable

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
    // Can also be configured via plugins.docsearch, but not recommended
    plugins: {
      docsearch: {},
    }
  })
})
```
