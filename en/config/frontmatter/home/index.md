---
url: /en/config/frontmatter/home/index.md
---
## Overview

Applicable only to the homepage. Configure in `{sourceDir}/README.md`.

Example:

```md
---
pageLayout: home
config:
  - type: banner
  - type: custom
---
```

## Configuration

### home&#x20;

* Type: `boolean`
* Details:

  Declares whether the page is the homepage.

  Deprecated. Please use `pageLayout: 'home'` instead.

### pageLayout

* Type: `'home'`
* Details:

  Declares the current page as the homepage.

### config

* Type: `PlumeHomeConfig[]`

Defines homepage sections.

```ts
interface PlumeHomeConfigBase {
  /**
   * The type of this section, which determines the component to be applied
   */
  type: 'banner' | 'hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom' | string
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
}
```

For more detailed configuration, please refer to [Custom Homepage](../../guide/custom/home.md).

### signDown

* Type: `boolean`
* Default: `false`
* Details:

  Whether to display the downward arrow indicator.
