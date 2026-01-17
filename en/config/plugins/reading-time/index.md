---
url: /en/config/plugins/reading-time/index.md
---
## Overview

Generates word count and estimated reading time for each page.

Related plugin: [@vuepress/plugin-reading-time](https://ecosystem.vuejs.press/plugins/search/docsearch.html)

Default configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readingTime: {
      wordPerMinute: 300
    },
    // Can also be configured via plugins.readingTime, but not recommended
    plugins: {
      readingTime: {}
    }
  }),
})
```

## Configuration

### wordPerMinute

* Type: `number`
* Default: `300`

Words read per minute.

### locales

* Type: `ReadingTimePluginLocaleConfig`

Internationalization configuration for the reading time plugin.

```ts
interface ReadingTimePluginLocaleData {
  /**
   * Word count template, where `$word` will be automatically replaced with the actual word count
   */
  word: string

  /**
   * Text for less than one minute
   */
  less1Minute: string

  /**
   * Time template
   */
  time: string
}

interface ReadingTimePluginLocaleConfig {
  [localePath: string]: ReadingTimePluginLocaleData
}
```

## Disabling

You can disable this feature by setting `readingTime` to `false`.

When disabled, article pages will not display word count and estimated reading time.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readingTime: false
  }),
})
```
