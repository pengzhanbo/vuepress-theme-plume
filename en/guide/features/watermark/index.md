---
url: /en/guide/features/watermark/index.md
---
## Overview

Article watermarking is powered by [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html).

The theme supports adding watermarks to articles. Both full-page watermarks and content-area watermarks
are supported, along with image watermarks and text watermarks.

## Enabling Watermark

Watermark functionality is disabled by default in the theme. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // watermark: true,
    watermark: {
      // enabled: false,  // boolean type to control global enablement
      enabled: page => true, // function type to filter which pages enable watermark
      delay: 500, // Delay for adding watermark. In milliseconds.

      /**
       * Whether to use full-page watermark, defaults to `true`.
       * When set to `false`, the watermark is only displayed in the content area.
       */
      fullPage: true,

      /** @see https://zhensherlock.github.io/watermark-js-plus/zh/config/ */
      watermarkOptions: {
        content: 'your watermark',
        // ...
      }
    }
  })
})
```

### Global Enablement

When `plugins.watermark` is set to `true`, the theme enables watermark globally.

```ts
export default defineUserConfig({
  theme: plumeTheme({
    watermark: true,
  })
})
```

### Partial Page Enablement

The theme provides two methods to control watermark enablement on specific pages.

#### watermark.enabled

```ts
export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      // Pages returning true will enable watermark, others will disable it
      enabled: page => page.path.includes('/article/'),
    }
  })
})
```

#### frontmatter.watermark

Add `frontmatter.watermark` as `true` in the md file:

```md
---
watermark: true
---
```

You can also customize the watermark configuration for the current page:

```md
---
watermark:
  content: My Custom Content
  globalAlpha: 0.2
  rotate: 45
---
```

## Image Watermark

The theme supports using images as watermarks.

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      watermarkOptions: {
        contentType: 'image',
        image: '/images/watermark.png',
        width: 200,
        height: 200,
        imageWidth: 100,
        imageHeight: 100,
      }
    }
  })
})
```

You can also add configuration in the md file to set watermark for the current page:

```md
---
watermark:
  contentType: image
  image: /images/watermark.png
  width: 200
  height: 200
  imageWidth: 100
  imageHeight: 100
---
```

### Example

[Image Watermark](/article/i4cuuonn/)

## Text Watermark

The theme supports using text as watermarks.

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      watermarkOptions: {
        content: 'Custom Text',
        fontColor: '#fff', // Text color
      }
    }
  })
})
```

You can also add configuration in the md file to set watermark for the current page:

```md
---
watermark:
  content: Custom Text
  fontColor: #fff
---
```

## Frontmatter

The theme supports adding `frontmatter.watermark` in md files to set watermarks for individual pages.

```md
---
watermark:
  content: My Custom Content
---
```

For supported configuration options, please refer to: [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/)

Additionally, `fullPage` is supported to control whether to display the watermark full-screen.

```md
---
watermark:
  fullPage: false
---
```

## Examples

* [Content Watermark](/article/2z59hh8g/)
* [Full-page Watermark](/article/97s6ha1e/)
