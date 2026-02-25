---
url: /en/config/frontmatter/friends/index.md
---
## Overview

Applicable to friends links pages.

Example:

```md
---
pageLayout: friends
title: Friends Links
cols: 2
list:
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    location: Guangzhou, China
    organization: VuePress
    desc: Even if slow, never stop. Even if falling behind, even if failing, one must be able to reach the goal they aspire to.
    socials:
      -
        icon: github
        link: https://github.com/pengzhanbo
      -
        icon: twitter
        link: https://twitter.com/pengzhanbo
---
```

## Configuration

### friends&#x20;

* Type: `boolean`
* Default: `false`
* Details:

  Whether the current page is a friends links page.

### pageLayout

* Type: `'friends'`
* Details:

  Declares the current page as a friends links page.

### title

* Type: `string`
* Default: `Friends Links`

The title of the friends links page.

### description

* Type: `string`

The description of the friends links page.

### contentPosition&#x20;

* Type: `'before' | 'after'`
* Default: `'after'`

Whether the markdown content is placed before or after the friends links list. By default, it is inserted after the list.

### cols

* Type: `number`
* Default: `1`

The maximum number of columns displayed per line in the friends link list is generally best set to `2` / `3`.

### list

* Type: `FriendsItem[]`
* Default: `[]`

The friends links list.

```ts
interface FriendsItem {
  /**
   * Friends link name
   */
  name: string
  /**
   * Friends link URL
   */
  link: string
  /**
   * Friends link avatar
   */
  avatar?: string
  /**
   * Friends link description
   */
  desc?: string
  /**
   * Geographic location
   */
  location?: string
  /**
   * Organization/Company
   */
  organization?: string

  /**
   * Social links
   */
  socials?: SocialLink[]

  /**
   * Background color
   */
  backgroundColor?: string | { light: string, dark: string }
  /**
   * Font color
   */
  color?: string | { light: string, dark: string }
  /**
   * Name color
   */
  nameColor?: string | { light: string, dark: string }
}
```

For social link configuration, please refer to [Configuration/Theme Configuration/Social Links](../../config/theme.md#social).

### groups

* Type: `FriendsGroup[]`
* Default: `[]`

Friends links grouping.

```ts
interface FriendsGroup {
  /**
   * Group title
   */
  title?: string
  /**
   * Group description
   */
  desc?: string
  /**
   * Friends links list
   */
  list?: FriendsItem[]
}
```
