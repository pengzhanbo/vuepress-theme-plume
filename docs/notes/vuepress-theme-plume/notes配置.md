---
title: notes配置
createTime: 2022/05/14 10:43:53
author: pengzhanbo
permalink: /note/vuepress-theme-plume/notes-config/
---

`notes` 功能，是为了在本主题满足了 Blog的基本功能后，期望能够 以 `note` 或者 `book` 的形式聚合文章而形成的，形式上类似于 `vuepress` 默认主题的功能。同时也减少了配置的复杂度。

## 配置
所有主题内部使用的插件， 均在 `notes` 字段中进行配置。
``` js {3-5}
module.exports = {
  themeConfig: {
    notes: {
      // this
    }
  }
}
```

## 配置字段

### dir

- 类型: `string`
- 默认值: `'_notes'`
- 详情：所有notes存放的目录，该目录相对于`sourceDir`。
  
  示例
  ```
  ├─ {sourceDir}
  │  ├─ _notes
  │  │  └─ typescript学习笔记
  │  └─ README.md
  ```

### link

- 类型： `string`
- 默认值： `'/note/'`
- 详情： 作为notes内的文章链接的前缀。自定义是请以 `'/'` 开头

### notes

- 类型： `PlumeThemeNotesItem[]`
- 默认值： `[]`
- 详情： note数组，配置多个 note

#### `PlumeThemeNotesItem`
``` ts
interface PlumeThemeNotesItem {
  /**
   * note 标题
   */
  text: string
  /*
   * note 链接，相对于 前面配置的 link。
   * 如 /typescript-learn/  映射到访问链接则为 /note//typescript-learn/
   */
  link: string
  /*
   * note 所在的目录，相对于 前面配置的 dir
   * 如 typescript 则实际路径为 {sourceDir}/_notes/typescript
   */
  dir: string
  /*
   * 当前 note 的sidebar配置
   */
  sidebar?: PlumeThemeSidebarConfigOptions | 'auto'
}
type PlumeThemeSidebarConfigOptions = (PlumeThemeNotesConfigItem | string)[]

interface PlumeThemeNotesConfigItem {
  text: string
  link?: string
  children: PlumeThemeNotesConfigItem[]
}
```
### notes\[index\].sidebar

这个字段是用于配置当前 note 的 sidebar 左侧导航栏

- 类型： `(PlumeThemeNotesConfigItem | string)[]`
- 详情：
  - 如果子元素为字符串时，可以是相对于 dir目录的md文件路径，可以省略`.md`后缀，也可以是生成的文章，`frontmatter`中的
    `permalink`的链接， 如果为空，则表示当前文件夹下的 `README.md`文件
  - 如果子元素是`PlumeThemeNotesConfigItem`, 其中 `text` 表示 sidebar显示的文案，
    `link` 等价于 上一条 string 的规则。
    `children` 可以继续嵌套`(PlumeThemeNotesConfigItem | string)`

## 示例

在`_notes` 文件夹下用如下文件结构
```
_notes
└── vuepress-theme-plume
    ├── README.md
    ├── note配置.md
    ├── 主题配置.md
    ├── 快速开始.md
    ├── 编写文章.md
    ├── 页面配置.md
    └── 主题插件配置.md
```

则可以进行如下配置：

::: code-tabs
@tab config.ts
``` ts
import { defineUserConfig } from 'vuepress'
import type {PlumeThemeOptions } from '@vuepress-plume/vuepress-theme-plume'
import notes from './notes.ts'
export default defineUserConfig<PlumeThemeOptions>({
  themeConfig: {
    notes: {
      dir: '_notes',
      link: '/note/',
      notes,
    }
  }
})
```

@tab notes.ts
``` ts
export default [
  {
    text: 'VuePress-theme-plume',
    dir: 'vuepress-theme-plume',
    link: '/vuepress-theme-plume',
    sidebar: [
      '',
      {
        text: '指南',
        children: [
          '快速开始',
          '编写文章',
        ]
      },
      {
        text: '配置',
        children: [
          {
            text: '主题配置',
            link: '主题配置',
            children: [
              '主题插件配置',
              'notes配置',
            ]
          },
          '页面配置',
        ]
      },
      {
        text: '功能',
        children: []
      }
    ]
  }
]
```
:::

其效果 即为 本文档 左侧 sidebar 展示效果。
