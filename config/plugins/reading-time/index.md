---
url: /config/plugins/reading-time/index.md
---
## 概述

为每个页面生成字数统计与预计阅读时间。

关联插件： [@vuepress/plugin-reading-time](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html)

默认配置：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readingTime: {
      wordPerMinute: 300
    },
    // 也可以通过 plugins.readingTime 配置，但不推荐
    plugins: {
      readingTime: {}
    }
  }),
})
```

## 配置

### wordPerMinute

* 类型：`number`
* 默认值：`300`

每分钟阅读字数。

### locales

* 类型: `ReadingTimePluginLocaleConfig`

阅读时间插件的国际化配置。

```ts
interface ReadingTimePluginLocaleData {
  /**
   * 字数模板，模板中 `$word` 会被自动替换为字数
   */
  word: string

  /**
   * 小于一分钟文字
   */
  less1Minute: string

  /**
   * 时间模板
   */
  time: string
}

interface ReadingTimePluginLocaleConfig {
  [localePath: string]: ReadingTimePluginLocaleData
}
```

## 禁用

可以通过配置 `readingTime` 为 `false` 禁用该功能。

禁用后，文章页不会显示字数统计与预计阅读时间。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readingTime: false
  }),
})
```
