---
url: /en/guide/features/copyright/index.md
---
## Overview

The theme supports adding **copyright** declarations for articles.

Articles typically originate from original works, reposts, translations, etc.
Adding copyright information for different sources helps better protect intellectual property rights and avoid copyright disputes.

### Creative Commons

The theme natively supports copyright declarations using [Creative Commons](https://creativecommons.org/) licenses, including:

* [CC0 1.0 Universal (CC0)](https://creativecommons.org/publicdomain/zero/1.0/)

* [Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)

* [Attribution-ShareAlike 4.0 International (CC-BY-SA-4.0)](https://creativecommons.org/licenses/by-sa/4.0/)

* [Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0)](https://creativecommons.org/licenses/by-nc/4.0/)

* [Attribution-NoDerivatives 4.0 International (CC-BY-ND-4.0)](https://creativecommons.org/licenses/by-nd/4.0/)

* [Attribution-NonCommercial-ShareAlike 4.0 International (CC-BY-NC-SA-4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

* [Attribution-NonCommercial-NoDerivatives 4.0 International (CC-BY-NC-ND-4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/)


You can select different licenses based on your requirements, or define custom licenses.

### Copyright Information

Copyright information includes:

* Copyright owner, copyright owner link
* Copyright license, copyright license link
* Original work link

This information is displayed at the bottom of articles.

::: tip It is recommended to enable the [Contributors](./contributors.md) feature when using this
functionality. For original articles, the theme automatically uses the first contributor as the
copyright owner. You can also manually specify the copyright owner in the article frontmatter.
:::

## Global Configuration

You can declare the `CC-BY-4.0` license for all articles on your site with the following configuration:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    copyright: 'CC-BY-4.0' // [!code hl]
  })
})
```

You can declare a custom copyright license for all articles on your site with the following configuration:

```ts :no-line-numbers title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    copyright: { // [!code hl:6]
      license: {
        name: 'MIT', // License name
        url: 'https://your-license-url' // License URL
      },
      author: {
        name: 'Your Name', // Copyright owner name
        url: 'https://your-author-url' // Copyright owner URL
      },
      creation: 'reprint' // Creation type
    }
  })
})
```

**Configuration Type:**

```ts
export type CopyrightLicense
  = | 'CC-BY-4.0'
    | 'CC-BY-SA-4.0'
    | 'CC-BY-NC-4.0'
    | 'CC-BY-NC-SA-4.0'
    | 'CC-BY-ND-4.0'
    | 'CC-BY-NC-ND-4.0'
    | 'CC0'
    | string

/**
 * - When set to `true`, defaults to `CC-BY-4.0`
 * - When set to `false`, copyright is hidden, but can be overridden in article frontmatter.copyright
 */
type CopyrightOptions = boolean | string | CopyrightLicense | {
  /**
   * Copyright license
   */
  license?: CopyrightLicense | {
    name: CopyrightLicense | string
    url: string
  }
  /**
   * Copyright owner. If not configured, defaults to obtaining from git commit records
   */
  author?: {
    name: string
    url?: string
  }
  /**
   * Creation type: original, translation, or repost
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'
}
```

::: warning Global configuration only applies to original articles. For non-original articles,
you should configure copyright information in the article frontmatter.
:::

## Article Frontmatter Configuration

You can configure copyright information for individual articles in the article frontmatter to override global configuration:

```md
---
title: My Article
copyright: CC-BY-4.0
---
```

**Configuration Type:**

```ts
/**
 * When set to `false`, copyright is hidden
 * When set to `true`, defaults to the global copyright configuration
 */
export type CopyrightFrontmatter = boolean | string | CopyrightLicense | {
  /**
   * Copyright license
   */
  license?: CopyrightLicense | { name: string, url: string }

  /**
   * Copyright owner
   * - For original articles, defaults to the first contributor
   * - For non-original articles, the copyright owner must be declared
   */
  author?: string | { name: string, url?: string }

  /**
   * Article creation type: original, translation, or repost
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'

  /**
   * Original article URL. Must be declared for non-original works
   * @default ''
   */
  source?: string
}
```

## Article Configuration Examples

### Original Article

```md
---
title: My Article
copyright: CC-BY-4.0
---
```

### Reposted Article

```md
---
title: Reposted Article
copyright:
  creation: reprint
  license: CC-BY-4.0
  source: https://example.com/origin
  author:
    name: Reposter
    url: https://example.com/author
---
```

### Translated Article

```md
---
title: Translated Article
copyright:
  creation: translate
  license: CC-BY-4.0
  source: https://example.com/origin
  author:
    name: Original Author
    url: https://example.com/author
---
```

### Custom License

```md
---
title: My Article
copyright:
  license:
    name: MIT
    url: https://example.com/mit
---
```
