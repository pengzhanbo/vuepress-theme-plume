---
url: /en/config/watermark/index.md
---
## Overview

The theme's built-in watermark plugin adds watermarks to the entire site or individual pages.

Related plugin: [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html)

## Usage

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // watermark: true,
    watermark: {
      // enabled: false,  // boolean type controls global enablement
      enabled: page => true, // function type filters which pages enable watermark

      /**
       * Whether to enable full-page watermark, defaults to `true`,
       * When set to `false`, watermark is only displayed in the content area.
       */
      fullPage: true,

      /** @see https://zhensherlock.github.io/watermark-js-plus/zh/config/ */
      watermarkOptions: {
        content: 'your watermark',
        // ...
      }
    },
    // Can also be configured via plugins.watermark, but not recommended
    plugins: {
      watermark: {}
    }
  })
})
```

## Configuration Options

### enabled

* Type: `boolean | ((page: Page) => boolean)`

* Default: `false`

* Details:

  Specifies which pages should have watermarks added.

  Pages with a `true` value will have watermarks applied.

### watermarkOptions

* Type: `WatermarkOptions`

* Default: `undefined`

* Details: Configuration options refer to [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/).

#### watermarkOptions.parent

* Type: `string`

* Default: `body`

* Details: Parent element selector for adding watermarks.

  By default inserted into the body, can be specified to insert into a specific element on the page.

## Frontmatter

### watermark

* Type: `boolean | WatermarkOptions`

* Details:

  When type is `boolean`, indicates whether to enable watermark.

  When type is `WatermarkOptions`, indicates current page watermark configuration.

  Refer to [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) for configuration options.

```md
---
watermark:
  width: 200
  height: 200
  content: Your content
  opacity: 0.5
---
```
