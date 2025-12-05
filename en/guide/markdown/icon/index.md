---
url: /en/guide/markdown/icon/index.md
---
## Overview

The theme supports icons from the following sources in Markdown files:

* [iconify](https://iconify.design/) - Supported by default
* [iconfont](https://www.iconfont.cn/) - Optional
* [fontawesome](https://fontawesome.com/) - Optional

The theme provides Markdown syntax support for icons, offering a simple and flexible way to insert icons in Markdown.

[The theme also provides `<Icon />` component support. Click to learn more](../components/icon.md){.read-more}

## Syntax

Icon syntax is inline syntax and can be mixed with other Markdown syntax within paragraphs.

**Basic Syntax**: Use `::` to wrap the icon name:

```md
::name::
```

**Setting Icon Size and Color**: (Note: Spaces are required)

```md
::name =size::
::name /color::
::name =size /color::
```

* `=size`: Set icon size
  * `=16`: Icon width and height are `16px`
  * `=24x16`: Icon width is `24px`, height is `16px`
  * `=x16`: Icon height is `16px`, width is auto
  * `=1.2em`: Icon width and height are `1.2em`
  * `=1.2emx1.5em`: Icon width is `1.2em`, height is `1.5em`

* `/color`: Set icon color, supports `hex`/`rgb`/`rgba`/`hsl`/`hsla` and other valid color values
  * `/#fff`: Icon color is `#fff`
  * `/rgb(255,0,0)`: Icon color is `rgb(255,0,0)`

## Iconify

[iconify](https://iconify.design/) provides support for **200K+** open source icons, sufficient for most project needs.
The theme uses **iconify** as the default icon source.

Use the `::collect:name` syntax in Markdown to insert icons.

### Configuration

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

```ts
interface IconOptions {
  provider: 'iconify'
  prefix?: string
}
```

### Usage

::: steps

* Search for the desired icon at [iconify search](https://icon-sets.iconify.design/) and copy the icon name:

  ![iconify](/images/icon/iconify-1.png)

* Use the `::collect:name` syntax in Markdown to insert the icon

  ```md
  ::carbon:home::
  ```

  **Output:** ::carbon:home::

:::

In Iconify, icons are organized into different `collect`s, each containing several icons.
In the `::collect:name` syntax, use `:` to separate `collect` and `name`.

If you primarily use icons from a specific `collect`, you can specify `prefix` in the configuration
to omit the `collect` prefix in the `::collect:name` syntax:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      icon: {
        provider: 'iconify',
        prefix: 'carbon', // Use `carbon` icon collection by default // [!code ++]
      }
    }
  })
})
```

```md
::home::    <!-- Uses `carbon` icon collection by default, auto-completes to `carbon:home` -->
::solar:user-bold::  <!-- Explicitly use other icon collections -->
```

**Output:** ::carbon:home:: ::solar:user-bold::

### Installation

For enterprise internal projects or situations where external network resources cannot be accessed,
the theme recommends installing the `@iconify/json` dependency.

The theme automatically parses icon data from `@iconify/json` and packages used icons as local resources.

::: npm-to

```sh
npm install @iconify/json
```

:::

### Examples

Input:

```md
github: ::tdesign:logo-github-filled::
Change color: ::tdesign:logo-github-filled /#f00::
Change size: ::tdesign:logo-github-filled =36px::
Change size and color: ::tdesign:logo-github-filled =36px /#f00::

Colorful icon ::skill-icons:vscode-dark =36px::
```

Output:

github: ::tdesign:logo-github-filled::
Change color: ::tdesign:logo-github-filled /#f00::
Change size: ::tdesign:logo-github-filled =36px::
Change size and color: ::tdesign:logo-github-filled =36px /#f00::

Colorful icon ::skill-icons:vscode-dark =36px::

## Iconfont

[iconfont](https://www.iconfont.cn/) provides massive icon support.

### Configuration

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: {
        provider: 'iconfont',
        assets: 'https://at.alicdn.com/t/c/xxxx.css' // Example URL
      }
    }
  })
})
```

```ts
interface IconOptions {
  provider: 'iconfont'
  /**
   * Icon prefix
   * @default 'iconfont icon-'
   */
  prefix?: string

  /**
   * iconfont resource URL
   */
  assets: string | string[]
}
```

### Usage

[Go to **iconfont Help Center** to learn about **Creating Projects** and **Adding Icons**](https://www.iconfont.cn/help/detail){.read-more}

:::steps

* Get the project resource URL from iconfont, copy and paste it into the `assets` configuration:

  ![iconfont assets](/images/icon/iconfont-1.png)

  ```ts title=".vuepress/config.ts"
  export default defineUserConfig({
    theme: plumeTheme({
      markdown: {
        icon: {
          provider: 'iconfont',
          assets: 'https://at.alicdn.com/t/c/xxxx.css' // Example URL // [!code ++]
        }
      }
    })
  })
  ```

  You can also choose to download it locally, store the resources in the `.vuepress/public` directory,
  and then fill in the local file path in the `assets` configuration.

* Check the iconfont project configuration to get the `prefix` configuration:

  ![iconfont prefix](/images/icon/iconfont-2.png)

  The `prefix` configuration consists of `font family` and `font class` prefix. If the iconfont project uses default settings,
  then `prefix` is `iconfont icon-`, in which case you can skip this step.

  ```ts title=".vuepress/config.ts"
  export default defineUserConfig({
    theme: plumeTheme({
      markdown: {
        icon: {
          provider: 'iconfont',
          prefix: 'iconfont icon-', // Default value  // [!code ++]
        }
      }
    })
  })
  ```

* Use the `::name::` syntax in Markdown to insert icons:

  ![iconfont name](/images/icon/iconfont-3.png)

  Fill the `font class` from the image into the `::name::` syntax:

  ```md
  ::hot::
  ::hot =24px::
  ::hot =24px /#f00::
  ```

  Output:




:::

## Fontawesome

[Fontawesome](https://fontawesome.com/) provides both free and paid icon support. Paid icons require a subscription.

[View **Fontawesome** official documentation](https://docs.fontawesome.com/web/setup/get-started){.read-more}

### Configuration

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: { // [!code ++:3]
      icon: {
        provider: 'fontawesome',
        assets: 'fontawesome' // Preset resource URL, loaded from CDN
      }
    }
  })
})
```

```ts
interface IconOptions {
  provider: 'fontawesome'
  /**
   * Icon prefix
   * @default 'fas'
   */
  prefix?: FontAwesomePrefix
  /**
   * iconfont resource URL
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

[In **Fontawesome**, icons are controlled by families + styles. **View details**](https://docs.fontawesome.com/web/add-icons/how-to#setting-different-families--styles){.read-more}

For easier management, you can use the `::prefix:name::` syntax to set families + styles through the prefix.
The default prefix is `fas`, which can be omitted:

```md
::name:: <!-- prefix = fas -->
::fas:name:: <!-- prefix = fas -->
::s:name:: <!-- prefix = fas, s is shorthand for fas -->
```

You can modify the default prefix by configuring `markdown.icon.prefix`.

::: tip
Fontawesome's free icons only support `solid`, some `regular`, and `brands`.
For the free version, prefixes only support `fas` / `far` / `fab` and their shorthand prefixes.
:::

### Usage

[Go to **https://fontawesome.com/search?ic=free** to search for free icons](https://fontawesome.com/search?ic=free){.read-more}

:::steps

* Copy the icon name:

  ![fontawesome name](/images/icon/fontawesome-1.png)

* Use the `::prefix:name::` syntax in Markdown to insert the icon:

  ```md
  ::circle-user:: <!-- prefix = fas -->
  ::fas:circle-user:: <!-- prefix = fas -->
  ::s:circle-user:: <!-- prefix = fas, s is shorthand for fas -->
  ```

:::

### Examples

```md
::circle-user::
::circle-user =24px::
::circle-user =24px /#f00::
```

Output:

[Add more style support for Fontawesome](https://docs.fontawesome.com/web/style/styling){.read-more}

```
::circle-user 2xl::  <!-- 2xl is shorthand for fa-2xl, icon size is 2em -->
::circle-user rotate-90:: <!-- icon rotated 90 degrees -->
::circle-user beat:: <!-- icon animation -->
::circle-user border:: <!-- icon border -->
::circle-user 2xl beat:: <!-- mixed styles -->
```

Output:

## Additional Notes

When `markdown.icon.provider` is set to a value other than `iconify`, `iconify` remains supported by default,
and you can still insert iconify icons in Markdown:

In the `::collect:name::` syntax, add `iconify` at the beginning:

```md /iconify /
::iconify carbon:home::
```

Output:

::iconify carbon:home::
