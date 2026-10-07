---
title: Content Search
createTime: 2025/10/09 09:19:26
permalink: /en/config/plugins/search/
---

## Local Search

### Overview

Adds local search functionality to the site.

For feature details, please refer to [Search Feature](../../guide/features/search.md)

Related plugin: [@vuepress-plume/plugin-search](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-search)

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
  })
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

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
   *
   * Note: encrypted pages (matched by `encrypt.rules` or having a page `password`)
   * are never indexed, because the search index is shipped as a public static asset
   * and indexing them would leak their content.
   */
  isSearchable?: (page: Page) => boolean
}

interface SearchBoxLocale {
  placeholder: string
  buttonText: string
  resetButtonTitle: string
  backButtonTitle: string
  noResultsText: string
  /**
   * Text shown when the search index is missing or fails to load
   */
  searchIndexErrorText?: string
  /**
   * Fallback text shown when JavaScript is disabled
   *
   * It is rendered inside `<noscript>`, so it must be plain text without
   * HTML-escaped characters
   */
  noscriptText?: string
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

Refer to [Algolia DocSearch Reference](../../guide/features/search.md#algolia-docsearch) for more information.

### Enable

```ts title=".vuepress/config.ts" twoslash
// @errors: 2353
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
  })
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).
