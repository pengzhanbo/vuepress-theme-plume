---
title: Homepage
createTime: 2025/10/09 15:00:43
permalink: /en/config/frontmatter/home/
---

## Overview

Applicable only to the homepage. Configure in `{sourceDir}/README.md`.

Example:

```md title="frontmatter"
---
pageLayout: home
config:
  - type: banner
  - type: custom
---
```

## Configuration

### home <Badge type="warning" text="Deprecated" />

- Type: `boolean`
- Details:

  Declares whether the page is the homepage.

  Deprecated. Please use `pageLayout: 'home'` instead.

### pageLayout

- Type: `'home'`
- Details:

  Declares the current page as the homepage.

### config

- Type: `ThemeHomeConfig[]`

Defines homepage sections, rendered in array order.

```ts
interface ThemeHomeConfigBase {
  /**
   * The type of this section, which determines the component to be applied
   *
   * When another string is passed, it is resolved as a global component name, used for custom section components.
   */
  type: 'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text'
    | 'features' | 'profile' | 'custom' | 'posts' | string

  /**
   * The index of this section
   *
   * The theme re-injects this value at render time according to the order of the `config` array, so it is usually not needed when writing frontmatter by hand;
   * however, it is a required field in the source types, so it must be provided when using TS to constrain frontmatter.
   */
  index: number

  /**
   * Whether this section should be full-screen
   */
  full?: boolean

  /**
   * Background image for this section
   * You can define background images for light/dark modes
   */
  backgroundImage?: string | { light: string, dark: string }

  /**
   * Background attachment style for this section
   */
  backgroundAttachment?: 'fixed' | 'local'

  /**
   * The theme automatically derives this from the length of `config` at render time (it is `true` when the length is 1) and overrides the passed value,
   * so setting this field in the config has no effect.
   */
  onlyOnce?: boolean
}
```

For more detailed configuration, please refer to [Custom Homepage](../../guide/custom/home.md).

### signDown

- Type: `boolean`
- Default: `false`
- Details:

  Whether to display the downward arrow indicator.
