---
url: /en/config/plugins/watermark/index.md
---
## Overview

The theme's built-in watermark plugin adds watermarks to the entire site or individual pages.

Related plugin: [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/plugins/features/watermark.html)

For feature details, please refer to [Watermark Feature](../../guide/features/watermark.md)

## Usage

```ts title=".vuepress/config.ts" twoslash
// @errors: 7006
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
  })
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

## Configuration Options

### enabled

* Type: `boolean | ((page: Page) => boolean)`

* Default: `true`

* Details:

  Specifies which pages should have watermarks added.

  Pages with a `true` value will have watermarks applied.

  ::: tip The default `true` does not conflict with "no watermark when not configured"
  The theme only registers the watermark plugin when `watermark` is configured (either the top-level `watermark` or `plugins.watermark`),
  and it explicitly passes `enabled: true` when registering. Therefore **when `watermark` is not configured, no watermark appears anywhere on the site**;
  the `true` here describes the default behavior once the watermark has been configured, and it is not an on/off switch.
  :::

### fullPage

* Type: `boolean`

* Default: `true`

* Details:

  Whether to use a full-page watermark. This is a theme extension field; `@vuepress/plugin-watermark` itself does not have this option.

  * `true`: The watermark covers the entire page
  * `false`: The watermark is only displayed within the content area

  A single page can also override this by setting `watermark.fullPage: false` in frontmatter.

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

```md title="frontmatter"
---
watermark:
  width: 200
  height: 200
  content: Your content
  opacity: 0.5
---
```
