---
url: /en/config/frontmatter/article/index.md
---
## Overview

Applicable to articles with collection type set to 'post'.

Example:

```md title="frontmatter"
---
title: Article Title
tags:
  - tag1
  - tag2
---
```

## Configuration

### sticky

* Type: `boolean | number`
* Default: `false`

Whether to pin the current article to the top in article lists.

If a `number` is provided, a higher value will position the article closer to the top when pinned. `true` ranks above any number, while `0`, negative numbers and `false` are all treated as "not sticky".

::: tip
Sticky articles are only pinned **on the first page of the article list**. From the second page onward, articles are shown in the normal chronological order.
:::

### article

* Type: `boolean`
* Default: `true`

Whether to display the current article in article lists.

### draft

* Type: `boolean`
* Default: `false`

Marks the article as a draft. Draft articles are **completely excluded** from the production build: no page is generated, and they never appear in article lists, the search index, `sitemap.xml`, `llms.txt`, or any other output. They are only accessible in the dev server. See [draft](./basic.md#draft) for details.

### tags

* Type: `string[]`
* Default: `[]`

Article tags.

### cover

* Type: `string`
* Default: `''`

Article cover image. The cover image is only displayed on the article list page.

Only absolute paths and remote image URLs are supported.

### coverStyle

* Type: `PostsCoverStyle`
* Default: `undefined`

Cover image configuration.

```ts
type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface PostsCoverStyle {
  /**
   * Layout position of the blog post cover image
   */
  layout?: PostsCoverLayout
  /**
   * Aspect ratio of the blog post cover image
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}` | `${number}/${number}`

  /**
   * Width of the cover image, only effective when layout is 'left' or 'right'
   *
   * @default 240
   */
  width?: number
  /**
   * Whether to use compact mode. In compact mode, the cover image fits snugly against the container edge.
   * @default false
   */
  compact?: boolean
}
```

### excerpt

* Type: `boolean | string`
* Default: `undefined`

Whether to display the article excerpt. When a `string` is passed, it is used as a custom excerpt, and the `<!-- more -->` comment is ignored.

### relatedPosts

* Type: `false | string[]`
* Default: `undefined`

Related posts of the current page.

* `false`: disable related posts for this page
* `string[]`: a manual list of links, which takes precedence over the computed result

```yaml title="blog/hello.md"
---
relatedPosts:
  - /blog/vue3-reactivity/
  - /blog/vue3-computed/
---
```

::: tip
`relatedPosts` must be enabled in the [theme config](../theme.md#relatedposts) or the [collection config](../collections.md) first.
:::

::: tip Other fields of the article frontmatter

* `createTime`: Creation time, see [Basic frontmatter](./basic.md#createtime)
* `password` / `passwordHint`: Article encryption, see [Encryption](../../guide/features/encryption.md)
* `copyright`: Copyright information, see [Copyright](../../guide/features/copyright.md)
  :::
