---
url: /en/guide/components/icon/index.md
---
## Overview

The `<Icon />` component loads icons from different icon libraries based on the `markdown.icon` configuration.

[The theme also provides markdown syntax support. Click to learn more](../markdown/v-icons.md){.read-more}

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

::: field name
@type `string | { svg: string }`
@required
Icon name. Supports iconify icon names, icon links (`https://…` or `/…`), and inline SVG objects `{ svg: '<svg>…</svg>' }`.
When `markdown.icon.prefix` has a value, the prefix in `name` can be omitted.
:::

::: field provider
@type `'iconify' | 'iconfont' | 'fontawesome'`
@default Determined by `markdown.icon.provider` (defaults to `'iconify'`)
Icon provider. You can also force a specific provider by using the `iconify` / `iconfont` / `fontawesome` prefix followed by a space in `name`.
:::

::: field color
@type `string`
@default `'currentcolor'`
Icon color.
:::

::: field size
@type `string | number`
@default `'1em'`
Icon size. A number is treated as `px`, and the `20x20` form is also supported to specify width and height separately.
:::

::: field extra
@type `string`
@default `undefined`
Extra CSS class name. Fontawesome icons automatically prepend the `fa-` prefix for class names without it.
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
