---
url: /en/guide/components/icon/index.md
---
## Overview

The `<Icon />` component loads icons from different icon libraries based on the `markdown.icon` configuration.

[The theme also provides markdown syntax support. Click to learn more](../markdown/icons.md){.read-more}

## Configuration

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: { provider: 'iconify' } // Enabled by default
    }
  })
})
```

```ts
interface IconOptions {
  /**
   * Icon provider
   */
  provider: 'iconify' | 'iconfont' | 'fontawesome'
  /**
   * Default icon prefix. Different providers have different default prefixes
   * - iconify - Default: `''`
   * - iconfont - Default: `iconfont icon-`
   * - fontawesome - Default: `fas`
   */
  prefix?: string
  /**
   * Icon asset links
   */
  assets?: IconAssetLink | IconAssetLink[]
  size?: string | number
  color?: string
}
```

## Props

:::: field-group

::: field name="name" type="string" default="''" optional
Icon name. When `markdown.icon.prefix` has a value, the prefix in `name` can be omitted.
:::

::: field name="color" type="string" default="'currentcolor'" optional
Icon color.
:::

::: field name="size" type="string" default="'1em'" optional
Icon size.
:::

::::

## Examples

**Input:**

```md :no-line-numbers
- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />
```

**Output:**

* home -&#x20;
* vscode -&#x20;
* twitter -&#x20;
