---
url: /guide/markdown/icon/index.md
---
## 概述

主题支持在 Markdown 文件中以下来源的图标：

* [iconify](https://iconify.design/) - 默认支持
* [iconfont](https://www.iconfont.cn/) - 可选
* [fontawesome](https://fontawesome.com/) - 可选

主题提供图标 markdown 语法支持，使用简单灵活的方式在 Markdown 中插入图标。

[主题还提供了 `<Icon />` 组件支持，点击了解更多](../components/icon.md){.read-more}

## 语法

图标语法为行内语法，可以在段落中与其他 markdown 语法混合使用。

**基础语法**，使用 `::` 包裹图标名称：

```md
::name::
```

**设置图标大小和颜色**：(注意空格不可缺少)

```md
::name =size::
::name /color::
::name =size /color::
```

* `=size`： 设置图标大小

  * `=16`： 图标的宽高为 `16px`
  * `=24x16`： 图标的宽为 `24px`，高为 `16px`
  * `=x16`： 图标的高为 `16px`，宽为自适应
  * `=1.2em`： 图标的宽高为 `1.2em`
  * `=1.2emx1.5em`： 图标的宽为 `1.2em`，高为 `1.5em`

* `/color`： 设置图标颜色，支持 `hex`/ `rgb` / `rgba` / `hsl` / `hsla` 等合法颜色色值

  * `/#fff` ： 图标的颜色为 `#fff`
  * `/rgb(255,0,0)`： 图标的颜色为 `rgb(255,0,0)`

## Iconify

[iconify](https://iconify.design/) 提供了 **200K +** 的开源图标支持，足以满足大多数项目的需求。
主题将 **iconify** 作为默认的图标来源支持。

在 Markdown 中使用 `::collect:name` 语法来插入图标。

### 配置

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
  provider: 'iconify'
  prefix?: string
}
```

### 使用

::: steps

* 从 [iconify search](https://icon-sets.iconify.design/) 搜索想要使用的图标，复制图标名称：

  ![iconify](/images/icon/iconify-1.png)

* 在 Markdown 中使用 `::collect:name` 语法来插入图标

  ```md
  ::carbon:home::
  ```

  **输出：** ::carbon:home::

:::

在 Iconify 中，图标被分为不同的 `collect`，每个 `collect` 下有若干个图标。
在 `::collect:name` 语法中，使用 `:` 来分隔 `collect` 和 `name`。

如果你主要使用某个 `collect` 下的图标，可以在配置中指定 `prefix`, 以便在 `::collect:name` 语法中省略 `collect` 前缀：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      icon: {
        provider: 'iconify',
        prefix: 'carbon', // 默认使用 `collect` 图标集合 // [!code ++]
      }
    }
  })
})
```

```md
::home::    <!-- 默认使用 `carbon` 图标集，自动补全为 `carbon:home` -->
::solar:user-bold::  <!-- 显式的使用其他图标集 -->
```

**输出：** ::carbon:home:: ::solar:user-bold::

### 安装

对于企业内部项目，或无法访问外部网络资源的情况下，主题推荐安装 `@iconify/json` 依赖。

主题自动解析 `@iconify/json` 中的图标数据，将已使用的图标打包为本地资源。

::: npm-to

```sh
npm install @iconify/json
```

:::

### 示例

输入：

```md
github: ::tdesign:logo-github-filled::
修改颜色：::tdesign:logo-github-filled /#f00::
修改大小：::tdesign:logo-github-filled =36px::
修改大小颜色：::tdesign:logo-github-filled =36px /#f00::

彩色图标 ::skill-icons:vscode-dark =36px::
```

输出：

github: ::tdesign:logo-github-filled::
修改颜色：::tdesign:logo-github-filled /#f00::
修改大小：::tdesign:logo-github-filled =36px::
修改大小颜色：::tdesign:logo-github-filled =36px /#f00::

彩色图标 ::skill-icons:vscode-dark =36px::

## Iconfont

[iconfont](https://www.iconfont.cn/) 是提供了海量的图标支持。

### 配置

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: {
        provider: 'iconfont',
        assets: 'https://at.alicdn.com/t/c/xxxx.css' // 示例地址
      }
    }
  })
})
```

```ts
interface IconOptions {
  provider: 'iconfont'
  /**
   * 图标前缀
   * @default 'iconfont icon-'
   */
  prefix?: string

  /**
   * iconfont 资源地址
   */
  assets: string | string[]
}
```

### 使用

[前往 **iconfont 帮助中心** 了解 **创建项目**和 **添加图标**](https://www.iconfont.cn/help/detail){.read-more}

:::steps

* 从 iconfont 获取项目的资源地址，复制并粘贴到 `assets` 配置中：

  ![iconfont assets](/images/icon/iconfont-1.png)

  ```ts title=".vuepress/config.ts"
  export default defineUserConfig({
    theme: plumeTheme({
      markdown: {
        icon: {
          provider: 'iconfont',
          assets: 'https://at.alicdn.com/t/c/xxxx.css' // 示例地址 // [!code ++]
        }
      }
    })
  })
  ```

  也可以选择下载至本地，将资源存放到 `.vuepress/public` 目录中，然后在 `assets` 配置中填写本地文件路径。

* 检查 iconfont 的项目配置，获取 `prefix` 配置：

  ![iconfont prefix](/images/icon/iconfont-2.png)

  其中 `prefix` 配置由 `font family` 和 `font class` 前缀组成，如果 iconfont 的项目配置为默认配置，
  则 `prefix` 为 `iconfont icon-`，此时你可以忽略此步骤。

  ```ts title=".vuepress/config.ts"
  export default defineUserConfig({
    theme: plumeTheme({
      markdown: {
        icon: {
          provider: 'iconfont',
          prefix: 'iconfont icon-', // 默认值  // [!code ++]
        }
      }
    })
  })
  ```

* 在 Markdown 中使用 `::name::` 语法来插入图标：

  ![iconfont name](/images/icon/iconfont-3.png)

  将图片中的 `font class` 填入 `::name::` 语法中：

  ```md
  ::hot::
  ::hot =24px::
  ::hot =24px /#f00::
  ```

  输出:




:::

## Fontawesome

[Fontawesome](https://fontawesome.com/) 提供了 免费 和 付费 的图标支持，付费图标需要进行订阅。

[查看 **Fontawesome** 官方文档](https://docs.fontawesome.com/web/setup/get-started){.read-more}

### 配置

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: {
        provider: 'fontawesome',
        assets: 'fontawesome' // 预设资源地址，从 CDN 加载
      }
    }
  })
})
```

```ts
interface IconOptions {
  provider: 'fontawesome'
  /**
   * 图标前缀
   * @default 'fas'
   */
  prefix?: FontAwesomePrefix
  /**
   * iconfont 资源地址
   */
  assets: (FontAwesomeAssetBuiltin | string)[]
}

type FontAwesomeAssetBuiltin = 'fontawesome' | 'fontawesome-with-brands'

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

[在 **Fontawesome** 中，图标通过 families + styles 控制样式，**查看详情**](https://docs.fontawesome.com/web/add-icons/how-to#setting-different-families--styles){.read-more}

为便于管理，可以通过 `::prefix:name::` 语法，通过前缀设置 families + styles，默认前缀为 `fas`，可以省略它：

```md
::name:: <!-- prefix = fas -->
::fas:name:: <!-- prefix = fas -->
::s:name:: <!-- prefix = fas ， s 为 fas 的缩写 -->
```

可以通过配置 `markdown.icon.prefix` 修改默认前缀。

::: tip
Fontawesome 的免费图标仅支持 `solid` 、部分 `regular` 以及 `brands`，
对于免费版本，前缀仅支持 `fas` / `far` / `fab` 和它们的缩写前缀。
:::

### 使用

[前往 **https://fontawesome.com/search?ic=free** 搜索免费图标](https://fontawesome.com/search?ic=free){.read-more}

:::steps

* 复制图标名称：

  ![fontawesome name](/images/icon/fontawesome-1.png)

* 在 Markdown 中使用 `::prefix:name::` 语法插入图标:

  ```md
  ::circle-user:: <!-- prefix = fas -->
  ::fas:circle-user:: <!-- prefix = fas -->
  ::s:circle-user:: <!-- prefix = fas， s 为 fas 的缩写 -->
  ```

:::

### 示例

```md
::circle-user::
::circle-user =24px::
::circle-user =24px /#f00::
```

输出:

[为 Fontawesome 添加更多样式支持](https://docs.fontawesome.com/web/style/styling){.read-more}

```
::circle-user 2xl::  <!-- 2xl 为 fa-2xl 的缩写, 图标大小为 2em -->
::circle-user rotate-90:: <!-- 图标旋转 90 度 -->
::circle-user beat:: <!-- 图标动画 -->
::circle-user border:: <!-- 图标边框 -->
::circle-user 2xl beat:: <!-- 混合多种样式 -->
```

输出:

## 其它说明

当 `markdown.icon.provider` 设置为非 `iconify` 时，`iconify` 作为默认支持，依然可以在
markdown 中插入 iconify 图标：

在 `::collect:name::` 语法中，在开始位置添加 `iconify`：

```md /iconify /
::iconify carbon:home::
```

输出:

::iconify carbon:home::
