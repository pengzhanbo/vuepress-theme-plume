---
url: /guide/auto-frontmatter/index.md
---
## 自动生成 frontmatter

主题 自动为每个 Markdown 文件生成 frontmatter。

::: details 什么是 frontmatter ?
Frontmatter（前言）是在 Markdown 文件最开头部分使用 YAML 格式编写的元数据区块。
你可以把它想象成 Markdown 文件的“身份证”或“配置说明书”，它不会被直接渲染成网页内容，而是用于配置该文件的相关参数。

Frontmatter 使用三个连字符（---）包裹，位于文件的最开头：

```md
---
title: Post Title
createTime: 2026/01/15 15:03:10
---

这里是 Markdown 正文内容...
```

:::

当前主题支持自动生成的 frontmatter 包括:

* `title`: 文章标题，根据文件名生成
* `createTime`: 文章创建时间，根据文件创建时间生成
* `permalink`: 文章链接
  * 默认使用 `nanoid` 生成 8 位随机字符串
  * 可以设置为 `filepath` 根据文件路径生成

## 配置

### 全局配置

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // autoFrontmatter: true, // 主题内置配置
    autoFrontmatter: {
      title: true, // 自动生成标题
      createTime: true, // 自动生成创建时间
      permalink: true, // 自动生成永久链接
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // autoFrontmatter: true, // 主题内置配置
  autoFrontmatter: {
    title: true, // 自动生成标题
    createTime: true, // 自动生成创建时间
    permalink: true, // 自动生成永久链接
  }
})
```

:::

### 集合配置

可以给每一个集合单独配置 autoFrontmatter

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
        // autoFrontmatter: true, // 主题内置配置
        autoFrontmatter: {
          title: true, // 自动生成标题
          createTime: true, // 自动生成创建时间
          permalink: true, // 自动生成永久链接
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
      // autoFrontmatter: true, // 主题内置配置
      autoFrontmatter: {
        title: true, // 自动生成标题
        createTime: true, // 自动生成创建时间
        permalink: true, // 自动生成永久链接
      }
    }
  ]
})
```

:::

### 自定义处理逻辑

使用 `transform(data, context, locale)` 配置自定义处理逻辑，`data` 为 frontmatter 数据，`context` 为文件上下文，`locale` 为当前语言路径。

* `transform()` 也可以是异步函数，返回 Promise。
* `transform()` 适用于 全局配置 和 集合配置 中。

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    autoFrontmatter: {
      title: true, // 自动生成标题
      createTime: true, // 自动生成创建时间
      permalink: true, // 自动生成永久链接
      transform: (data, context, locale) => { // 自定义转换
        // context.filePath // 文件绝对路径
        // context.relativePath // 文件相对路径，相对于源目录
        // context.content // markdown 正文内容

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
    title: true, // 自动生成标题
    createTime: true, // 自动生成创建时间
    permalink: true, // 自动生成永久链接
    transform: (data, context, locale) => { // 自定义转换
      // context.filePath // 文件绝对路径
      // context.relativePath // 文件相对路径，相对于源目录
      // context.content // markdown 正文内容

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
   * 文件绝对路径
   */
  filepath: string
  /**
   * 文件相对路径
   */
  relativePath: string
  /**
   * 文件 markdown 内容
   */
  content: string
}

interface AutoFrontmatterOptions {
  /**
   * 是否自动生成 permalink
   *
   * - `false`: 不自动生成 permalink
   * - `true`: 自动生成 permalink ，使用 nanoid 生成 8 位数随机字符串
   * - `filepath`: 根据文件路径生成 permalink
   *
   * @default true
   */
  permalink?: boolean | 'filepath'
  /**
   * 是否自动生成 createTime
   *
   * 默认读取 文件创建时间，`createTime` 比 vuepress 默认的 `date` 时间更精准到秒
   */
  createTime?: boolean
  /**
   * 是否自动生成 title
   *
   * 默认读取文件名作为标题
   */
  title?: boolean

  /**
   * 自定义 frontmatter 生成函数
   *
   * - 你应该直接将新字段添加到 `data` 中
   * - 如果返回全新的 `data` 对象，会覆盖之前的 frontmatter
   * @param data 页面已存在的 frontmatter
   * @param context 当前页面的上下文信息
   * @param locale 当前语言路径
   * @returns 返回处理后的 frontmatter
   */
  transform?: (data: AutoFrontmatterData, context: AutoFrontmatterContext, locale: string) => AutoFrontmatterData | Promise<AutoFrontmatterData>
}
```

## 永久链接 permalink

主题默认使用 `nanoid` 生成一个 8 位的随机字符串作为文件的永久链接。

还可以将 `permalink` 配置为 `'filepath'` ，根据文件路径生成永久链接。
请注意，如果你的文件路径中，包含中文，主题建议在你的项目中安装 `pinyin-pro` ，
以支持将中文转换为拼音。

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

示例：

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

你应该已经发现 示例中的 `都城.md` 文件的 permalink 为 `/blog/dou-cheng/` ,这显然是错误的，这是因为 `pinyin-pro`
默认的词库对于多音字并不能精确的识别，如果你需要更为精确的转换结果，可以手动安装 `@pinyin-pro/data`，
主题为自动加载该词库，以提高精度。

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
