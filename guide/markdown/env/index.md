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
      abbr: true, // 启用缩写词，使 env.abbreviations 生效
      annotation: true, // 启用内容注释，使 env.annotations 生效
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

::: important 缩写词与内容注释需要额外启用
`env.references` 始终生效。但 `env.abbreviations` 和 `env.annotations` 需要分别启用 `abbr` 和 `annotation` 选项后才会生效。
:::

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

## 预设示例

### 预设链接引用

链接引用支持两种定义形式：字符串形式和对象形式。对象形式可以额外设置 `title` 属性。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      env: {
        references: {
          // 字符串形式：直接指定链接地址
          vue: 'https://vuejs.org/',
          // 对象形式：可以同时指定链接地址和标题
          vuepress: {
            href: 'https://v2.vuepress.vuejs.org/',
            title: 'VuePress 官方网站'
          }
        }
      }
    }
  })
})
```

在任意 markdown 文件中使用：

```md
[Vue][vue] 是一个渐进式框架。

[VuePress][vuepress] 是一个静态站点生成器。
```

### 预设缩写词

缩写词预设可以为项目中的专业术语统一定义全称，鼠标悬停时显示完整解释。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      abbr: true,
      env: {
        abbreviations: {
          HTML: 'HyperText Markup Language',
          CSS: 'Cascading Style Sheets',
          W3C: 'World Wide Web Consortium',
          API: 'Application Programming Interface'
        }
      }
    }
  })
})
```

在任意 markdown 文件中直接使用缩写词即可，无需额外声明：

```md
HTML 和 CSS 是 Web 开发的基础技术，相关标准由 W3C 维护。
通过 API 可以访问这些技术提供的能力。
```

### 预设内容注释

内容注释支持字符串形式和字符串数组形式。使用数组形式时，同一个标签会对应多条注释，以列表形式渲染。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      annotation: true,
      env: {
        annotations: {
          // 字符串形式：单条注释
          vuepress: 'VuePress 是一个 [静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG) 。专为构建快速、以内容为中心的站点而设计。',
          // 数组形式：多条注释，以列表形式渲染
          名著: [
            '**《三国演义》：**\n以三国时期的历史为背景，描写了魏、蜀、吴三国之间的政治、军事斗争。',
            '**《西游记》：**\n讲述了唐僧师徒四人西天取经的故事，充满了神话色彩和奇幻冒险。'
          ]
        }
      }
    }
  })
})
```

在任意 markdown 文件中使用 `[+label]` 语法引用注释：

```md
站点由 VuePress [+vuepress] 驱动。

中国古代 **四大名著** [+名著] 家喻户晓。
```

## 加载机制与优先级

### 加载方式

环境预设通过 `.vuepress/config.ts` 中的 `markdown.env` 选项进行配置。主题在初始化 Markdown 渲染器时，会将预设值注入到每个 Markdown 文件的渲染环境中，使预设值在所有 Markdown 文件中全局可用。

* **链接引用** (`references`)：在 Markdown 渲染时注入到渲染环境，始终生效。
* **缩写词** (`abbreviations`)：作为全局缩写词传递给缩写词插件，需要启用 `abbr` 选项。
* **内容注释** (`annotations`)：作为全局注释传递给注释插件，需要启用 `annotation` 选项。

### 优先级

当同一个标签在预设配置和 Markdown 文件中同时定义时，遵循以下优先级规则（从高到低）：

* **链接引用**：Markdown 文件中的定义 > `env.references` 预设
* **缩写词**：Markdown 文件中的定义 > `markdown.abbr` 配置 > `env.abbreviations` 预设
* **内容注释**：Markdown 文件中的定义 > `markdown.annotation` 配置 > `env.annotations` 预设

这意味着在单个 Markdown 文件中定义的同名标签会覆盖全局预设，方便对特定页面进行定制。

### 修改预设后的生效方式

环境预设属于 VuePress 配置的一部分，修改 `.vuepress/config.ts` 中的 `markdown.env` 配置后，VuePress 会自动重启开发服务器使配置生效。修改 Markdown 文件中的定义则无需重启，会即时热更新。

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
