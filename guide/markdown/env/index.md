---
url: /guide/markdown/env/index.md
---
## 概述

环境预设 (`markdown.env`) 可以用来配置一些 Markdown 渲染环境的预设值，
比如 引用链接、内容注释、缩写词等，从而避免在每个 markdown 文件中重复定义。

**环境预设在 任意 markdown 文件中都可以生效。**

## 配置

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      env: {
        // 引用链接
        references: {
          vuepress: 'https://v2.vuepress.vuejs.org/'
        },
        // 缩写词
        abbreviations: {
          HTML: 'Hypertext Markup Language'
        },
        // 内容注释
        annotations: {
          vuepress: 'VuePress 是一个 [静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG) 。专为构建快速、以内容为中心的站点而设计。'
        }
      }
    }
  })
})
```

以上配置等同于在 任意 markdown 文件中：

```md
[vuepress]: https://v2.vuepress.vuejs.org/

*[HTML]: Hypertext Markup Language

[+vuepress]: VuePress 是一个 [静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG) 。专为构建快速、以内容为中心的站点而设计。
```

因此，可以在任意 markdown 文件中使用这些环境预设：

```md
链接引用：[vuepress][vuepress]

缩写词：HTML

内容注释：vuepress [+vuepress]
```

链接引用：[vuepress][vuepress]

缩写词：HTML

内容注释：vuepress \[+vuepress]

[vuepress]: https://v2.vuepress.vuejs.org/

\*\[HTML]: Hypertext Markup Language

\[+vuepress]: VuePress 是一个 [静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG) 。专为构建快速、以内容为中心的站点而设计。

## Interface

```ts
interface MarkdownEnvPreset {
  /**
   * 引用链接
   */
  references?: {
    [label: string]: string | { title?: string, href: string }
  }
  /**
   * 缩写词
   */
  abbreviations?: {
    [label: string]: string
  }
  /**
   * 内容注释
   */
  annotations?: {
    [label: string]: string | string[]
  }
}
```
