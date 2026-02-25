---
url: /guide/features/icon/index.md
---
## 概述

主题支持以下来源的图标：

* [iconify](https://iconify.design/) - 默认支持
* [iconfont](https://www.iconfont.cn/) - 可选
* [fontawesome](https://fontawesome.com/) - 可选

在主题的以下功能中以相同的方式使用图标：

* [导航栏图标](../../config/navbar.md#配置)
* [侧边栏图标](../../guide/document.md#侧边栏图标)
* [文件树图标](../../guide/markdown/file-tree.md)
* [代码分组标题图标](../code/code-tabs.md#分组标题图标)

提供语法糖和组件支持：

[Markdown 图标语法糖支持](../markdown/icons.md){.read-more}

[图标组件支持](../components/icon.md){.read-more}

::: tip 主题对图标的优化
上述的不同的使用图标的方式，主题在内部都采取了相同的解析策略，即使您在不同的位置使用了相同的图标，
也不会重复加载相同的图标资源。
:::

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

## 配置项

### provider

* **类型**: `'iconify' | 'iconfont' | 'fontawesome'`
* **默认值**: `'iconify'`

图标提供商

### prefix

* **类型**: `string`
* **默认值**: `''` （不同的图标提供商有不同的默认值）
* **详情**:

  图标前缀

  * 提供商为 `iconify` 时，默认为 `''`，设置 `iconify` 的图标集作为前缀，比如 `mdi` 。
  * 提供商为 `iconfont` 时，默认为 `'iconfont icon-'`
  * 提供商为 `fontawesome` 时默认为 `'fas'`，可选值如下：

    ```ts
    type FontAwesomePrefix
      = | 'fas' | 's' // fa-solid fa-name
        | 'far' | 'r' // fa-regular fa-name
        | 'fal' | 'l' // fa-light fa-name
        | 'fat' | 't' // fa-thin fa-name
        | 'fads' | 'ds' // fa-duotone fa-solid fa-name
        | 'fass' | 'ss' // fa-sharp fa-solid fa-name
        | 'fasr' | 'sr' // fa-sharp fa-regular fa-name
        | 'fasl' | 'sl' // fa-sharp fa-light fa-name
        | 'fast' | 'st' // fa-sharp fa-thin fa-name
        | 'fasds' | 'sds' // fa-sharp-duotone fa-solid fa-name
        | 'fab' | 'b' // fa-brands fa-name
    ```

### assets

* **类型**: `(string | FontAwesomeAssetBuiltin)[] | string | FontAwesomeAssetBuiltin`

  ```ts
  type FontAwesomeAssetBuiltin = 'fontawesome' | 'fontawesome-with-brands'
  ```

* **默认值**: `undefined`

* **详情**:

  * `iconify` 时，不需要设置；
  * `iconfont` 时，设置为 iconfont 的资源地址；
  * `fontawesome` 时，设置为 `fontawesome` 的资源地址，可选值为 `fontawesome` 或 `fontawesome-with-brands`，
    或者自定义资源地址。

### size

* **类型**: `string | number`
* **默认值**: `1em`
* **详情**:

  图标的默认尺寸

### color

* **类型**: `string`
* **默认值**: `'currentColor'`
* **详情**:

  图标的默认颜色
