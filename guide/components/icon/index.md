---
url: /guide/components/icon/index.md
---
## 概述

图标组件 `<Icon />`，根据 `markdown.icon` 配置，从不同的图标库加载图标。

[主题还提供了 markdown 语法支持，点击了解更多](../markdown/v-icons.md){.read-more}

## 配置

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: { provider: 'iconify' } // 默认支持
    }
  })
})
```

```ts
interface IconOptions {
  /**
   * 图标提供商
   */
  provider: 'iconify' | 'iconfont' | 'fontawesome'
  /**
   * 图标默认前缀，不同的提供商默认前缀不同
   * - iconify - 默认为 `''`
   * - iconfont - 默认为 `iconfont icon-`
   * - fontawesome - 默认为 `fas`
   */
  prefix?: string
  /**
   * 图标资源地址
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
图标名称。支持 iconify 图标名、图标链接（`https://…` 或 `/…`），以及内联 SVG 对象 `{ svg: '<svg>…</svg>' }`。
当 `markdown.icon.prefix` 有值时，`name` 中的前缀可以省略。
:::

::: field provider
@type `'iconify' | 'iconfont' | 'fontawesome'`
@default 由 `markdown.icon.provider` 决定（默认 `'iconify'`）
图标提供商。也可以在 `name` 中使用 `iconify` / `iconfont` / `fontawesome` 加空格前缀强制指定。
:::

::: field color
@type `string`
@default `currentColor`
图标颜色
:::

::: field size
@type `string | number`
@default `1em`
图标大小。传入数字时按 `px` 处理，也支持 `20x20` 形式分别指定宽高。
:::

::: field extra
@type `string`
@default `undefined`
附加的 CSS 类名。fontawesome 图标会自动为不带 `fa-` 前缀的类名补上前缀。
:::

::::

## 示例

**输入：**

```md :no-line-numbers
- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />
```

**输出：**

* home -&#x20;
* vscode -&#x20;
* twitter -&#x20;
