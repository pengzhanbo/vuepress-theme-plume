---
url: /en/guide/collection/post/index.md
---
## Overview

**Post collections** are used to manage fragmented collections of multiple articles.
The term "fragmented" here refers to scenarios where articles have no strong relationships with
each other or only require flattened presentation. Typical applications include:

* Blog systems
* Thematic columns
* News and information
* Casual notes

This collection provides complete article management features:

* **Article list page** - Supports pinning, cover images, and excerpt display
* **Article category page** - Automatically generates categories based on directory structure
* **Article tag page** - Generates tags based on page `frontmatter.tags`
* **Article archive page** - Generates timeline archives based on `frontmatter.createTime`

Each page reserves areas for displaying personal information, supporting personal profiles or organizational information configuration.

::: info The theme supports configuring multiple post collections
:::

## Creating a Post Collection

A post collection can be created in three simple steps:

:::: steps

* **Create an articles directory**

  ::: file-tree

  * docs
    * ++ blog
      * ++ post-1.md
      * ++ post-2.md
      * ++ …
        :::

* **Configure collection parameters**

  ::: code-tabs#config

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [ // [!code focus:3]
        { type: 'post', dir: 'blog', title: 'Blog' }
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [ // [!code focus:3]
      { type: 'post', dir: 'blog', title: 'Blog' }
    ]
  })
  ```

  :::

* **Complete**

::::

After configuration, the theme automatically scans the `docs/blog` directory and generates the following pages:

* Article list page: `/blog/`
* Article category page: `/blog/categories/`
* Article tag page: `/blog/tags/`
* Article archive page: `/blog/archives/`

When `autoFrontmatter` is enabled, the system automatically generates permanent links for Markdown files:

```md title="docs/blog/post-1.md"
---
title: post-1
createTime: 2025/03/24 20:15:12
permalink: /blog/a1b2c3d4/
---
```

### Multi-language Support

Define post collections for different languages in the theme's multi-language configuration:

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': { // [!code focus:5]
        collections: [
          { type: 'post', dir: 'blog', title: 'Blog' }
        ]
      },
      '/en/': { // [!code focus:5]
        collections: [
          { type: 'post', dir: 'blog', title: 'Blog' }
        ]
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    '/': { // [!code focus:5]
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' }
      ]
    },
    '/en/': { // [!code focus:5]
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' }
      ]
    }
  }
})
```

:::

## Collection Directory Configuration

The `dir` parameter specifies the source file directory for the collection,
supporting both absolute and relative paths (both relative to the source directory):

```ts
dir: 'blog' // Points to docs/blog
dir: '/blog/' // Equivalent syntax
dir: './blog/' // Equivalent syntax
dir: '/team/blog/' // Points to docs/team/blog
```

::: info Under multi-language configuration, paths are relative to the language directory
:::

### File Filtering

Filter Markdown files using `include` and `exclude` configurations with
[picomatch ::quill:search::](https://chat.baidu.com/search?word=picomatch+glob+pattern){.no-icon} pattern matching:

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        // [!code hl:4]
        include: ['**/*.md'], // Include all .md files
        exclude: ['**/*.snippet.md'] // Exclude snippet files
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // [!code hl:4]
      include: ['**/*.md'], // Include all .md files
      exclude: ['**/*.snippet.md'] // Exclude snippet files
    }
  ]
})
```

:::

## Page Generation Configuration

Pages are generated based on the `dir` configuration by default, with full customization support:

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        // [!code hl:16]
        postList: true, // Enable article list page
        link: '/blog/', // List page link
        linkPrefix: '/blog/', // Article link prefix
        tags: true, // Enable tag page
        tagsLink: '/blog/tags/', // Tag page link
        tagsTheme: 'colored', // Tag theme colored|gray|brand
        tagsText: 'Tags', // Tag page title
        archives: true, // Enable archive page
        archivesLink: '/blog/archives/', // Archive page link
        archivesText: 'Archives', // Archive page title
        categories: true, // Enable category page
        categoriesLink: '/blog/categories/', // Category page link
        categoriesText: 'Categories', // Category page title
        categoriesExpand: 'deep', // Category expansion level number|'deep'
        categoriesTransform: categories => categories, // Category transformation function
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // [!code hl:16]
      postList: true, // Enable article list page
      link: '/blog/', // List page link
      linkPrefix: '/blog/', // Article link prefix
      tags: true, // Enable tag page
      tagsLink: '/blog/tags/', // Tag page link
      tagsTheme: 'colored', // Tag theme colored|gray|brand
      tagsText: 'Tags', // Tag page title
      archives: true, // Enable archive page
      archivesLink: '/blog/archives/', // Archive page link
      archivesText: 'Archives', // Archive page title
      categories: true, // Enable category page
      categoriesLink: '/blog/categories/', // Category page link
      categoriesText: 'Categories', // Category page title
      categoriesExpand: 'deep', // Category expansion level number|'deep'
      categoriesTransform: categories => categories, // Category transformation function
    }
  ]
})
```

:::

## Auto Frontmatter Generation

::: info Only takes effect after executing `vuepress dev` or `vuepress build`
:::

Supports collection-level frontmatter auto-generation with customizable transformation logic:

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        // [!code hl:10]
        autoFrontmatter: {
          title: true, // Auto-generate title
          createTime: true, // Auto-generate creation time
          permalink: true, // Auto-generate permanent link
          transform: (data, context, locale) => { // Custom transformation
            data.foo ??= 'foo'
            return data
          }
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // [!code hl:10]
      autoFrontmatter: {
        title: true, // Auto-generate title
        createTime: true, // Auto-generate creation time
        permalink: true, // Auto-generate permanent link
        transform: (data, context, locale) => { // Custom transformation
          data.foo ??= 'foo'
          return data
        }
      }
    }
  ]
})
```

:::

Generation example:

```md title="docs/blog/post-1.md"
---
title: post-1
createTime: 2025/03/24 20:15:12
permalink: /blog/a1b2c3d4/
---
```

## Profile Configuration

Each post collection supports independent profile display area configuration.
When not configured, it inherits from the [theme default profile settings](../../config/theme.md#profile).

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        // [!code hl:10]
        profile: {
          avatar: '/avatar.jpg', // Avatar path
          name: 'John Doe', // Display name
          description: 'Personal profile', // Profile text
          circle: true, // Circular avatar
          location: 'Guangzhou', // Location
          organization: 'Organization Name', // Organization
          layout: 'right', // Layout position left|right
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // [!code hl:10]
      profile: {
        avatar: '/avatar.jpg', // Avatar path
        name: 'John Doe', // Display name
        description: 'Personal profile', // Profile text
        circle: true, // Circular avatar
        location: 'Guangzhou', // Location
        organization: 'Organization Name', // Organization
        layout: 'right', // Layout position left|right
      }
    }
  ]
})
```

:::

## Social Links

The profile area supports social link configuration. When not configured, it inherits from the [theme default social settings](../../config/theme.md#social).

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        // [!code hl:9]
        social: [
        // use iconify name
          { icon: 'github', link: 'https://github.com/zhangsan' },
          {
            // use custom icon
            icon: { svg: '<svg>xxxxx</svg>', name: 'xxx' },
            link: 'https://xxx.com'
          },
        ],
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // [!code hl:9]
      social: [
        // use iconify name
        { icon: 'github', link: 'https://github.com/zhangsan' },
        {
        // use custom icon
          icon: { svg: '<svg>xxxxx</svg>', name: 'xxx' },
          link: 'https://xxx.com'
        },
      ],
    }
  ]
})
```

:::

Supports any icon from [Iconify](https://icon-sets.iconify.design/). Simply use the iconify name to load it automatically.

For icons in the `simple-icons` collection, the `simple-icons:` prefix can be omitted.
For example, `simple-icons:github` can be abbreviated as `github`.

Examples of common social icons:

::: flex

* discord ::simple-icons:discord::
* telegram ::simple-icons:telegram::
* facebook ::simple-icons:facebook::
* github ::simple-icons:github::
* instagram ::simple-icons:instagram::
* linkedin ::simple-icons:linkedin::
* mastodon ::simple-icons:mastodon::
* npm  ::simple-icons:npm::
* slack ::simple-icons:slack::
* twitter ::simple-icons:twitter::
* x ::simple-icons:x::
* youtube ::simple-icons:youtube::
* bluesky ::simple-icons:bluesky::
* tiktok ::simple-icons:tiktok::

- qq ::simple-icons:qq::
- weibo ::simple-icons:sinaweibo::
- bilibili ::simple-icons:bilibili::
- gitlab ::simple-icons:gitlab::
- docker ::simple-icons:docker::
- juejin ::simple-icons:juejin::
- zhihu ::simple-icons:zhihu::
- douban ::simple-icons:douban::
- steam ::simple-icons:steam::
- stackoverflow ::simple-icons:stackoverflow::
- xbox ::simple-icons:xbox::
- kuaishou ::simple-icons:kuaishou::
- twitch ::simple-icons:twitch::
- xiaohongshu ::simple-icons:xiaohongshu::

:::

[You can view all available icons of **simple-icons** here](https://icon-sets.iconify.design/simple-icons/){.readmore}

If **Iconify** cannot meet your needs, you can pass in the format `{ svg: string, name?: string }`
to use custom icons by providing the SVG source code string.

## Article Cover Configuration

The article list page supports cover image display with various layout and size options.

### Basic Configuration

Define cover image path in frontmatter:

```md{3}
---
title: Article Title
cover: /images/cover.jpg
---
```

**Path Specification**: Only absolute paths or remote URLs are supported. Local images must be placed in the `.vuepress/public` directory:

::: file-tree

* docs
  * .vuepress
    * public
      * images
        * cover.jpg
    * config.ts
  * article.md
    :::

Default display effect:

### Advanced Layout

Adjust cover image position and size:

```md{4-7}
---
title: Article Title
cover: /images/cover.jpg
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
---
```

Display effect:

### Compact Mode

Enable compact layout when no excerpt is present:

```md{8}
---
title: Article Title
cover: /images/cover.jpg
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
  compact: true
---
```

Display effect:

::: warning `compact: true` only takes effect when no excerpt is present
:::

### Top Banner Layout

```md{5}
---
title: Article Title
cover: /images/cover.jpg
coverStyle:
  layout: top
  ratio: 16:9
  width: 300
---
```

Display effect:

### Preset Configuration

For visual consistency, collection-level cover image presets are supported:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: 'Blog',
        postCover: {
          layout: 'left',
          ratio: '16:9',
          width: 300,
          compact: true
        }
      }
    ],
  })
})
```

Layout mode description:

```ts
type PostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface PostCoverStyle {
  layout?: PostCoverLayout // Layout position
  ratio?: number | `${number}:${number}` // Aspect ratio, default '4:3'
  width?: number // Width (effective for left/right layouts), default 240
  compact?: boolean // Compact mode, default false
}
```

Special layout modes:

* `odd-left` - Odd items left, even items right
* `odd-right` - Odd items right, even items left

`odd-left` layout effect:

::: warning Mobile Adaptation
Automatically switches to `top` layout on narrow-screen devices to ensure display quality
:::

## Article Metadata

## 文章元数据

In the collection, the `meta` option allows you to set the display method of article metadata,
This setting will directly affect the display of metadata on both the **article list page** and the **article content page**:

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:11]
        meta: {
          tags: true, // Whether to display labels
          /**
           * Whether to display the creation time, or set the time format
           * - 'short': Display as `2022-01-01`, default
           * - 'long': Display as `2022-01-01 00:00:00`
           */
          createTime: true, // boolean | 'short' | 'long'
          readingTime: true, // Whether to display the reading time estimate
          wordCount: true, // Whether to display the word count
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:11]
      meta: {
        tags: true, // Whether to display labels
        /**
         * Whether to display the creation time, or set the time format
         * - 'short': Display as `2022-01-01`, default
         * - 'long': Display as `2022-01-01 00:00:00`
         */
        createTime: true, // boolean | 'short' | 'long'
        readingTime: true, // Whether to display the reading time estimate
        wordCount: true, // Whether to display the word count
      }
    }
  ]
})
```

:::

In markdown, configure article metadata through frontmatter:

```md
---
title: Article Title
createTime: 2024/01/01 00:00:00
tags:
  - tag1
  - tag2
---
```

`title` and `createTime` are automatically generated when files are created and support manual modification.

### Available Properties

| Property   | Type                | Default      | Description                               |
| ---------- | ------------------- | ------------ | ----------------------------------------- |
| title      | `string`            | File name    | Article title                             |
| createTime | `string`            | Current time | Creation time                             |
| tags       | `string[]`          | `[]`         | Article tags                              |
| sticky     | `boolean \| number` | false        | Sticky flag, higher numbers sort first    |
| draft      | `boolean`           | false        | Draft mode, hidden after build            |
| cover      | `string`            | `''`         | Cover image path                          |
| coverStyle | `PostCoverStyle`    | `null`       | Cover style configuration                 |
| excerpt    | `boolean \| string` | ''           | Excerpt content, supports auto-extraction |

Also supports all fields from [common frontmatter configuration](../../config/frontmatter/basic.md).

## Article Excerpt Configuration

### Auto-extraction

Use `<!-- more -->` marker for excerpt truncation point:

```md
---
title: Title
---

Excerpt content area

<!-- more -->

Remaining body content
```

### Manual Definition

Custom excerpt via excerpt field:

```md
---
title: Title
excerpt: Custom excerpt content
---
```

**Configuration Notes**:

* `excerpt: false` - Disable excerpt (ignore `<!-- more -->`)
* `excerpt: string` - Custom content (ignore `<!-- more -->`)

::: tip Recommended to use \<!-- more --> comment to define excerpts
:::

## Configuring to Site Homepage

The theme provides two ways to set the post collection's article list page as the site homepage to meet different requirements:

* **Method 1: Configure homepage's `pageLayout` property to `posts`**

```md title="docs/README.md"
---
pageLayout: posts
---
```

You can also use the `collection` configuration item to specify which collection's article list page to read.
By default, it reads the first collection's article list page.

`collection` needs to match the `dir` value of the collection configuration.

```md title="docs/README.md"
---
pageLayout: posts
collection: blog
---
```

This configuration directly applies the `posts` layout to the page, displaying the blog article list.

This is the simplest way to change the homepage to a blog page, but it lacks flexibility.

* **Method 2: Configure homepage's `pageLayout` property to `home`, add homepage section type with `type: posts`**

```md title="docs/README.md"
---
pageLayout: home
config:
  - type: posts
    collection: blog
---
```

Using this method, you can not only add article lists to the homepage but also flexibly add different content in other areas of the page.

For example, configure the first screen as `banner`, followed by a blog article list:

```md title="docs/README.md"
---
pageLayout: home
config:
  - type: banner
  - type: posts
---
```

For more custom configurations, please refer to [Custom Homepage](../custom/home.md).

When using either of the above methods to configure the homepage as an article list page,
since the theme still generates the article list page by default, this results in duplicate functional pages.
Therefore, you may need to **disable automatic blog article list page generation** in the collection configuration:

(You can also modify the link addresses of category pages/tag pages/archive pages)

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      { type: 'post', dir: 'blog', title: 'Blog', postList: false }
    ],
  })
})
```
