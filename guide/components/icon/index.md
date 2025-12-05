---
url: /guide/components/icon/index.md
---
## 概述

图标组件 `<Icon />`，根据 `markdown.icon` 配置，从不同的图标库加载图标。

[主题还提供了 markdown 语法支持，点击了解更多](../markdown/icons.md){.read-more}

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

::: field name="name" type="string" default="''" optional
图标名称，当 `markdown.icon.prefix` 有值时，`name` 中的前缀可以省略
:::

::: field name="color" type="string" default="'currentcolor'" optional
图标颜色
:::

::: field name="size" type="string" default="'1em'" optional
图标大小
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
