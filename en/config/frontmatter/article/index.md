---
url: /en/config/frontmatter/article/index.md
---
## Overview

Applicable to articles with collection type set to 'post'.

Example:

```md
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

If a `number` is provided, a higher value will position the article closer to the top when pinned.

### article

* Type: `boolean`
* Default: `true`

Whether to display the current article in article lists.

### draft

* Type: `boolean`
* Default: `false`

Marks the article as a draft. Articles marked as drafts **only appear in article lists during development** and are hidden in production environments.

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

* Type: `BlogPostCoverStyle`
* Default: `null`

Cover image configuration.

```ts
interface PostCoverStyle {
  /**
   * Layout position of the blog post cover image
   */
  layout?: 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
  /**
   * Aspect ratio of the blog post cover image
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}`

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
