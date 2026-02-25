---
url: /guide/code/copy-code/index.md
---
## 概述

该功能由 [@vuepress/plugin-copy-code](https://ecosystem.vuejs.press/zh/plugins/features/copy-code.html) 提供支持。

主题默认启用了代码复制功能。支持 一键复制 在 文章中 展示的代码。

默认情况下， 主题会为每一个 代码块 添加一个复制按钮。该按钮仅在桌面端显示。

当鼠标悬停在 代码块 上时，在右上角会出现一个复制按钮。

## 配置

在 `.vuepress/config.ts` 配置文件中，修改 代码复制的行为：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    // copyCode: false  // 禁用代码复制
    copyCode: {
      // ...更多配置
    }
  })
})
```

### showInMobile

* **类型：** `boolean`
* **默认值：** `false`

是否在移动端显示复制按钮。

### ignoreSelector

* **类型：** `string | string[]`
* **默认值：** `[]`

代码块中的元素选择器，用于在复制时忽略相关元素。

例如: `['.token.comment']` 将忽略代码块中类名为 `.token.comment` 的节点 （这会在 prismjs 中忽略注释）。

### inlineSelector

* **类型：** `string | string[] | boolean`
* **默认值：** `false`

是否在双击时复制行内代码内容。

`boolean`: 是否在双击时复制行内代码内容。

`string[] | string`: 选择器，表示需要复制的行内代码内容。

### transform&#x20;

* **类型：** `(preElement: HTMLPreElement) => void`
* **默认值：** `null`

一个转换器，用于在复制之前对 `<pre>` 中代码块内容进行修改。该选项仅在使用 `useCopyCode()` 时有效。

## 组合式 API

该功能的组合式 API 可以在 `.vuepress/client.ts` 中配置：

```ts title=".vuepress/client.ts"
import { defineClientConfig } from '@vuepress/client'
import { useCopyCode } from '@vuepress/plugin-copy-code/client'

export default defineClientConfig({
  setup() {
    useCopyCode({
      // ...
    })
  },
})
```

### 示例

代码复制时，添加 copyright 信息

```ts title=".vuepress/client.ts"
import { defineClientConfig } from '@vuepress/client'
import { useCopyCode } from '@vuepress/plugin-copy-code/client'

export default defineClientConfig({
  setup() {
    useCopyCode({
      transform: (preElement) => {
        // 插入版权信息
        pre.innerHTML += `\n Copied by vuepress-theme-plume`
      },
    })
  },
})
```
