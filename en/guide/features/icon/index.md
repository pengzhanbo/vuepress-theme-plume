---
url: /en/guide/features/icon/index.md
---
## Overview

The theme supports icons from the following sources:

* [iconify](https://iconify.design/) - Supported by default
* [iconfont](https://www.iconfont.cn/) - Optional
* [fontawesome](https://fontawesome.com/) - Optional

Icons are used in the same way across the following theme features:

* [Navbar Icons](../../config/navbar.md#configuration)
* [Sidebar Icons](../../guide/document.md#sidebar-icons)
* [File Tree Icons](../../guide/markdown/file-tree.md)
* [Code Group Title Icons](../code/code-tabs.md#group-title-icons)

Provides syntax sugar and component support:

[Markdown Icon Syntax Sugar Support](../markdown/icons.md){.read-more}

[Icon Component Support](../components/icon.md){.read-more}

::: tip Theme Optimization for Icons
The theme employs the same parsing strategy internally for all the different ways of using icons
mentioned above. Even if you use the same icon in different locations, the same icon resources will not be loaded repeatedly.
:::

## Configuration

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: { provider: 'iconify' } // Supported by default
    }
  })
})
```

## Configuration Options

### provider

* **Type**: `'iconify' | 'iconfont' | 'fontawesome'`
* **Default**: `'iconify'`

Icon provider

### prefix

* **Type**: `string`
* **Default**: `''` (Different icon providers have different default values)
* **Details**:

  Icon prefix

  * When provider is `iconify`, defaults to `''`. Set the iconify collection as prefix, e.g., `mdi`.
  * When provider is `iconfont`, defaults to `'iconfont icon-'`
  * When provider is `fontawesome`, defaults to `'fas'`. Optional values are:

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

* **Type**: `(string | FontAwesomeAssetBuiltin)[] | string | FontAwesomeAssetBuiltin`

  ```ts
  type FontAwesomeAssetBuiltin = 'fontawesome' | 'fontawesome-with-brands'
  ```

* **Default**: `undefined`

* **Details**:

  * For `iconify`: No configuration needed;
  * For `iconfont`: Set to the resource URL of iconfont;
  * For `fontawesome`: Set to the resource URL of fontawesome. Optional values are `fontawesome` or
    `fontawesome-with-brands`, or custom resource URLs.

### size

* **Type**: `string | number`
* **Default**: `1em`
* **Details**:

  Default icon size

### color

* **Type**: `string`
* **Default**: `'currentColor'`
* **Details**:

  Default icon color
