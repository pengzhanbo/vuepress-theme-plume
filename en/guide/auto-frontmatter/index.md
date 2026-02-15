---
url: /en/guide/auto-frontmatter/index.md
---
## Auto-generating Frontmatter

This feature automatically generates frontmatter for each Markdown file.

::: details What is Frontmatter?
Frontmatter is a metadata block written in YAML format at the very beginning of a Markdown file.
You can think of it as the "ID card" or "configuration manual" of the Markdown file.
It won't be rendered into the web page content directly, but is used to configure relevant parameters for the file.

Frontmatter is wrapped using three dashes (`---`) and located at the very start of the file:

```md
---
title: Post Title
createTime: 2026/01/15 15:03:10
---

Here is the Markdown content...
```

:::

The current theme supports auto-generated frontmatter including:

* `title`: Article title, generated based on the file name
* `createTime`: Article creation time, generated based on the file creation time
* `permalink`: Article permalink
  * Uses `nanoid` to generate an 8-character random string by default
  * Can be set to `filepath` to generate based on the file path

## Configuration

### Global Configuration

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // autoFrontmatter: true, // Theme built-in configuration
    autoFrontmatter: {
      title: true, // Auto-generate title
      createTime: true, // Auto-generate creation time
      permalink: true, // Auto-generate permalink
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // autoFrontmatter: true, // Theme built-in configuration
  autoFrontmatter: {
    title: true, // Auto-generate title
    createTime: true, // Auto-generate creation time
    permalink: true, // Auto-generate permalink
  }
})
```

:::

### Collection Configuration

You can configure autoFrontmatter separately for each collection.

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        // autoFrontmatter: true, // Theme built-in configuration
        autoFrontmatter: {
          title: true, // Auto-generate title
          createTime: true, // Auto-generate creation time
          permalink: true, // Auto-generate permalink
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: '指南',
      // autoFrontmatter: true, // Theme built-in configuration
      autoFrontmatter: {
        title: true, // Auto-generate title
        createTime: true, // Auto-generate creation time
        permalink: true, // Auto-generate permalink
      }
    }
  ]
})
```

:::

### Custom Processing Logic

Use `transform(data, context, locale)` to configure custom processing logic.
`data` is the frontmatter data, `context` is the file context, and `locale` is the current language path.

* `transform()` can also be an async function, returning a Promise.
* `transform()` is applicable in both global configuration and collection configuration.

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    autoFrontmatter: {
      title: true, // Auto-generate title
      createTime: true, // Auto-generate creation time
      permalink: true, // Auto-generate permalink
      transform: (data, context, locale) => { // Custom transform
        // context.filePath // File absolute path
        // context.relativePath // File relative path, relative to source directory
        // context.content // Markdown content

        data.foo ??= 'foo'
        return data
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  autoFrontmatter: {
    title: true, // Auto-generate title
    createTime: true, // Auto-generate creation time
    permalink: true, // Auto-generate permalink
    transform: (data, context, locale) => { // Custom transform
      // context.filePath // File absolute path
      // context.relativePath // File relative path, relative to source directory
      // context.content // Markdown content

      data.foo ??= 'foo'
      return data
    }
  }
})
```

:::

### Interface

```ts
interface AutoFrontmatterContext {
  /**
   * File absolute path
   */
  filepath: string
  /**
   * File relative path
   */
  relativePath: string
  /**
   * File markdown content
   */
  content: string
}

interface AutoFrontmatterOptions {
  /**
   * Whether to auto-generate permalink
   *
   * - `false`: Do not auto-generate permalink
   * - `true`: Auto-generate permalink, using nanoid to generate an 8-digit random string
   * - `filepath`: Generate permalink based on file path
   *
   * @default true
   */
  permalink?: boolean | 'filepath'
  /**
   * Whether to auto-generate createTime
   *
   * Reads the file creation time by default. `createTime` is more precise to the second than VuePress's default `date` time.
   */
  createTime?: boolean
  /**
   * Whether to auto-generate title
   *
   * Reads the file name as the title by default.
   */
  title?: boolean

  /**
   * Custom frontmatter generation function
   *
   * - You should add new fields directly to `data`
   * - If a completely new `data` object is returned, it will overwrite the previous frontmatter
   * @param data Existing frontmatter on the page
   * @param context Context information of the current page
   * @param locale Current language path
   * @returns Returns the processed frontmatter
   */
  transform?: (data: AutoFrontmatterData, context: AutoFrontmatterContext, locale: string) => AutoFrontmatterData | Promise<AutoFrontmatterData>
}
```

## Permalink

The theme uses `nanoid` to generate an 8-character random string as the file's permalink by default.

You can also configure `permalink` as `'filepath'` to generate the permalink based on the file path.
Please note, if your file path contains Chinese characters,
the theme recommends installing `pinyin-pro` in your project to support converting Chinese to pinyin.

::: npm-to

```sh
npm i pinyin-pro
```

:::

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    autoFrontmatter: {
      permalink: 'filepath', // [!code hl]
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  autoFrontmatter: {
    permalink: 'filepath', // [!code hl]
  }
})
```

:::

Example:

::: code-tree

```md title="docs/blog/服务.md"
---
title: 服务
permalink: /blog/wu-fu/
---
```

```md title="docs/blog/都城.md"
---
title: 都城
permalink: /blog/dou-cheng/
---
```

:::

You probably noticed that in the example, the permalink for the `都城.md` file is `/blog/dou-cheng/`,
which is incorrect. This is because `pinyin-pro`'s default dictionary cannot accurately identify polyphonic
characters. If you need a more precise conversion result,you can manually install `@pinyin-pro/data`,
and the theme will automatically load this dictionary to improve accuracy.

::: npm-to

```sh
npm i @pinyin-pro/data
```

:::

```md title="docs/blog/都城.md"
---
title: 都城
permalink: /blog/du-cheng/
---
```
