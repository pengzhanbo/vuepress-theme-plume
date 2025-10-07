---
title: Blog
icon: material-symbols:article-outline
createTime: 2025/03/04 12:15:40
permalink: /en/guide/blog/
tags:
  - Guide
  - Quick Start
---

<script setup lang="ts">
import VPBlogProfile from 'vuepress-theme-plume/components/Blog/VPBlogProfile.vue'
import VPPostItem from 'vuepress-theme-plume/components/Blog/VPPostItem.vue'
</script>

## Overview

By default, the theme will treat all md files in the [documentation source directory](project-structure.md#documentation-source-directory) as blog posts, except for specific directories (e.g., the `notes` directory, which is used for notes).

The theme will also categorize blog posts based on the directory structure of the md files, using the **directory name** as the **category** of the blog post.

The theme will automatically generate a blog post list page with the link address `/blog/`, displaying all blog posts and relevant information about the blogger.

## Configuration

The blog feature is enabled by default in the theme, and you usually do not need to perform additional configurations.

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    // Disable the blog feature
    // blog: false,

    blog: {
      /**
       * Configure included files via glob string,
       * by default, it reads all `.md` files in the source directory, but excludes directories used for notes in the `notes` configuration.
       */
      include: ['**/*.md'],
      // If you want to only read articles from a specific directory in the source directory, such as the `blog` directory, you can configure it as:
      // include: ['blog/**/*.md'],

      /**
       * Configure excluded files via glob string, relative to the source directory
       */
      exclude: ['.vuepress/', '**/README.md'],

      // Disable pagination
      // pagination: false,
      // Number of articles displayed per page
      pagination: 15,
    }
  })
})
```

:::

## Blogger Information

The theme supports displaying basic information about the blogger.

<div
  style="width: 310px;margin: 0 auto;padding: 20px 20px 1px;text-align:center;border-radius: 4px;
  background-color: var(--vp-c-bg-soft);transition: background-color var(--vp-t-color);"
>
  <VPBlogProfile />
</div>

### Configuration

You can set the blogger's avatar and other related information through the `profile` attribute.

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    profile: {
      name: 'Your Name',
      description: 'Description text, motto/signature',
      avatar: '/blogger.png',
      location: 'Your Location',
      organization: 'Your Organization',
      circle: true, // Whether the avatar is circular
      layout: 'right', // Whether the personal information is on the left or right, 'left' | 'right'
    },
    // Social links
    social: [
      { icon: 'github', link: 'https://github.com/vuepress-theme-plume  ' },
      // ... more
    ]
  })
})
```

:::

## Article Metadata

You can configure the display of blog post metadata, such as title, author, date, tags, etc. This data is configured through `frontmatter`.

```md
---
title: Article Title
createTime: 2024/01/01 00:00:00
tags:
  - tag1
  - tag2
---
```

Among them, `title` / `createTime` will be automatically filled in by the theme when creating a new md file, and you can modify them at will.

The following are the available `frontmatter` properties in blog posts.

| Property    | Type                        | Default Value             | Description                                         |
| ----------- | --------------------------- | ------------------------- | --------------------------------------------------- |
| title       | `string`                    | Automatically filled in with the filename | Article title                                     |
| createTime  | `string`                    | Current time              | Article creation time                              |
| tags        | `string[]`                  | `[]`                      | Article tags                                       |
| sticky      | `boolean \| number`         | false                     | Whether to pin the article, if it's a number, the larger the number, the higher the pinning priority |
| draft       | `boolean`                   | false                     | Whether it's a draft, draft articles will not be displayed |
| cover       | `string`                    | `''`                      | Article cover image                                |
| coverStyle  | `BlogPostCoverStyle`        | `null`                    | Article cover image style                          |
| excerpt     | `boolean \| string`         | ''                        | Article excerpt, by default generated via `<!-- more -->` comment, passing a string indicates custom content, and it will no longer be extracted from the main text |

In addition to the above fields, you can also use the fields in the [general frontmatter configuration](../../config/frontmatter/basic.md) to flexibly control the behavior of the current page.

## Article Excerpt

If you want to add an excerpt to an article, you can use the `<!-- more -->` comment to mark it. Any content before this comment will be considered as the excerpt.

**Example:**

```md
---
title: Title
---

This content will be used as the excerpt

<!-- more -->

This content will not be used as the excerpt
```

You can also use `frontmatter.excerpt` to control whether the article displays an excerpt and to customize the excerpt content.

- `frontmatter.excerpt` defaults to `false`, indicating that the excerpt is not displayed, and the `<!-- more -->` comment will be ignored.
- When `frontmatter.excerpt` is of type `string`, it indicates custom excerpt content, and the `<!-- more -->` comment will be ignored.

**Example:**

```md
---
title: Title
excerpt: Custom excerpt content
---
```

You can use different methods to control the excerpt of the article as needed.

::: tip The theme more strongly recommends using the `<!-- more -->` comment to add excerpts
:::

## Article Cover Image

On the blog post list page, the theme supports adding cover images to articles and supports different layouts and flexible size configurations.

To add a cover image to a blog post, you can configure `cover` in `frontmatter`:

```md
---
title: Title
cover: /images/cover.jpg  # [!code ++]
---
```

**Cover images** only support absolute paths or remote paths. When using an absolute path, the image is loaded from the `.vuepress/public` directory.

::: file-tree

- docs
  - .vuepress
    - public
      - images
        - cover.jpg
    - config.ts
  - article.md
- …
  :::

The default effect is as follows:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ' }"
  :index="1"
/>
</div>

You can also adjust the layout position and aspect ratio of the cover image:

```md
---
title: Article Title
cover: /images/cover.jpg # [!code ++:5]
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
---
```

The effect is as follows:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ', coverStyle: { layout: 'left', ratio: '16:9', width: 300 } }"
  :index="1"
/>
</div>

When an article has no excerpt, it may look a bit empty. To address this, you can use `compact: true` to make the cover image fit the container edges, making the overall layout more compact:

```md
---
title: Article Title
cover: /images/cover.jpg # [!code ++:6]
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
  compact: true
---
```

The effect is as follows:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ',
  coverStyle: { layout: 'left', ratio: '16:9', width: 300, compact: true } }"
  :index="1"
/>
</div>

::: warning compact: true only takes effect when the article has no excerpt
:::

You can also set the cover image above the title, which becomes a large image style:

```md
---
title: Article Title
cover: /images/cover.jpg # [!code ++:5]
coverStyle:
  layout: top
  ratio: 16:9
  width: 300
---
```

The effect is as follows:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ',
  coverStyle: { layout: 'top', ratio: '16:9', width: 300 } }"
  :index="1"
/>
</div>

### Preset Configuration

Although the theme supports using different configurations for each article's cover image, for the sake of overall layout style and to simplify configuration, the theme also supports preset configurations for cover images:

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({

    blog: {
      // Configure the layout position of the cover image
      // postCover: 'left', // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
      postCover: {
        layout: 'left',
        ratio: '16:9',
        width: 300,
        compact: true
      }
    }
  })
})
```

:::

```ts
type BlogPostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface BlogPostCoverStyle {
  /**
   * The position of the blog post cover image
   */
  layout?: BlogPostCoverLayout
  /**
   * The aspect ratio of the blog post cover image
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}`

  /**
   * The width of the cover image, only effective when layout is 'left' or 'right'
   *
   * @default 240
   */
  width?: number
  /**
   * Whether to use compact mode, in compact mode, the cover image fits the container edges
   * @default false
   */
  compact?: boolean
}
```

You may have noticed that in the preset configuration's `layout`, there are also two configurations supported: `odd-left` and `odd-right`.

- `odd-left`: Indicates that odd items are on the left and even items are on the right
- `odd-right`: Indicates that odd items are on the right and even items are on the left

For example, the effect of `odd-left` is as follows:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;display: flex;flex-direction: column;gap: 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300, compact: true } }"
  :index="0"
/>
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300,compact: true } }"
  :index="1"
/>
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: 'Article Title',
  categoryList: [{id:'65f30c',sort:4,name:'Tutorial'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing  ',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300, compact: true } }"
  :index="2"
/>
</div>

::: warning Note
When on narrow screens of mobile devices, for visual effect considerations, the `layout` configuration is forcibly reset to `top`.
:::

## Tag Page, Category Page, and Archive Page

In addition to automatically generating the **blog post list page**, the theme will also automatically generate **tag pages**, **category pages**, and **archive pages**.

The tag page can filter and display blog posts based on tags, with the default address being `/blog/tags/`

The category page can display blog posts based on the original directory structure, with the default address being `/blog/categories/`

The archive page archives articles based on their creation time, with the default address being `/blog/archives/`

## Internationalization Support

If internationalization is enabled, the blog list page will display the blog list of the corresponding language directory based on different languages. That is, the article list of each language is kept independent.

Specifically, if one of your blog posts has different language versions, ensure that the same directory file structure and filename exist under different language directories. When switching languages, the theme can correctly switch to the corresponding language article.

::: file-tree

- docs
  - en
    - my-article.md
  - fr
    - my-article.md
  - my-article.md
:::

## Setting the Blog as the Homepage

By default, the theme separates the **homepage** and the **blog page**.

However, for users who want to build only a blog site, it might be a better choice to directly set the blog page as the **homepage**.

The theme provides two ways to set the blog as the homepage to meet different scenario needs:

- **Method One: Configure the `pageLayout` attribute of the homepage to `blog`**

::: code-tabs
@tab docs/README.md

```md
---
pageLayout: blog
---
```

:::

This configuration will directly apply the blog layout to the page, displaying the blog post list.

This is the simplest way to modify the homepage to a blog page, but the downside is the lack of flexibility.

- **Method Two: Configure the `pageLayout` attribute of the homepage to `home`, and add a homepage area type of `type: blog`**

::: code-tabs

@tab docs/README.md

```md
---
pageLayout: home
config:
  - type: blog
---
```

:::

With this method, you can not only add a blog post list to the homepage but also flexibly add different content to other areas of the page.

For example, configure the first screen as `banner`, followed by the blog post list:

::: code-tabs

@tab docs/README.md

```md
---
pageLayout: home
config:
  - type: banner
  - type: blog
---
```

:::

For more customization configurations, please refer to [Customize the Homepage](../custom/custom-home.md).

After using the above two methods to configure the homepage as the blog page, since the theme still generates the blog post list page with the address `/blog/` by default, this results in duplicate functional pages. Therefore, you need to [Theme Configuration > Blog Configuration](../../config/basic.md#blog) to **disable the automatic generation of the blog post list page**:

(You can also modify the link addresses of the category page/tag page/archive page)

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    blog: {
      postList: false, // Prevent the generation of the blog post list page
      // tagsLink: '/blog/tags/',
      // categoriesLink: '/blog/categories/',
      // archiveLink: '/blog/archives/',
    }
  })
})
```

:::
