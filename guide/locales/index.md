---
url: /guide/locales/index.md
---
本指南将帮助您快速为 VuePress 主题配置多语言支持。通过简单的目录结构和配置调整，即可实现专业的国际化站点。

## 目录结构规划

首先创建符合多语言要求的目录结构。以下示例展示支持中文、英文和法文的项目布局：

::: file-tree

* docs
  * **en**        # 英文文档目录
    * foo.md
    * README.md   # 英文首页
  * **fr**        # 法文文档目录
    * foo.md
    * README.md   # 法文首页
  * foo.md
  * README.md     # 中文首页
    :::

**目录结构说明**：

* `docs/en/` - 存储英文版本文档
* `docs/fr/` - 存储法文版本文档
* `docs/` - 存储默认语言（中文）文档

::: important 保持文件结构一致性
在不同语言目录中，请保持相同的文件名和目录结构。这确保主题能够在语言切换时正确导航到对应语言的文档版本。
:::

## VuePress 基础配置

### 设置默认语言

在配置文件 `.vuepress/config.ts` 中声明默认语言：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // 设置默认语言代码
  lang: 'zh-CN', // [!code ++]
  // 配置多语言支持
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // 简体中文作为默认语言
  }
})
```

### 添加其他语言支持

扩展 `locales` 配置来支持更多语言：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '博客' }, // 简体中文
    '/en/': { lang: 'en-US', title: 'Blog' }, // 美式英语 // [!code ++]
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // 法语 // [!code ++]
  }
})
```

**配置要点**：

* `locales` 的键名（如 `/en/`）对应文档目录中的语言文件夹名称
* 这些键名同时作为各语言页面的访问路径前缀
* 每个语言必须设置正确的 `lang` 属性，即使只使用单一语言

::: tip 语言代码规范

* **路径键名**：遵循 [ISO 639](https://zh.wikipedia.org/wiki/ISO_639-1) 标准（如英语使用 `/en/`）
* **语言代码**：使用 [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) 标准格式（如英语使用 `en-US`）
  :::

## 主题多语言配置

在主题配置中通过 `locales` 字段为每种语言定制化界面元素：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN', // [!code focus:6]
  locales: {
    '/': { lang: 'zh-CN', title: '博客' },
    '/en/': { lang: 'en-US', title: 'Blog' },
    '/fr/': { lang: 'fr-FR', title: 'Le blog' },
  },
  theme: plumeTheme({
    // 主题级多语言配置
    locales: { // [!code focus:20]
      // 简体中文配置
      '/': {
        selectLanguageName: '简体中文',
        navbar: [
          { text: '首页', link: '/' },
          { text: '博客', link: '/blog/' },
        ]
      },
      // 英文配置
      '/en/': {
        selectLanguageName: 'English',
        navbar: [
          { text: 'Home', link: '/en/' },
          { text: 'Blog', link: '/en/blog/' },
        ]
      },
      // 法文配置
      '/fr/': { // [!code focus:7]
        selectLanguageName: 'Français',
        navbar: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Le Blog', link: '/fr/blog/' },
        ]
      }
    }
  })
})
```

**关键配置项**：

* `selectLanguageName`：在语言选择器中显示的语言名称
* `navbar`：各语言独有的导航栏配置
* 所有主题配置项均支持在 `locales` 中按语言重写

## 配置一致性要求

确保 VuePress 配置与主题配置的路径键名完全匹配：

```ts
export default {
// VuePress 配置
  locales: {
    '/': { /* 中文配置 */ },
    '/en/': { /* 英文配置 */ },
  },

  // 主题配置
  theme: plumeTheme({
    locales: {
      '/': { /* 中文主题配置 */ },
      '/en/': { /* 英文主题配置 */ }
    }
  })
}
```

## 扩展阅读

* [主题 Locales 配置](../../config/theme.md#locale-配置) - 了解各语言专属的主题行为配置
* [多语言文本配置](../../config/locales.md) - 掌握界面文本的国际化定制方法

通过以上配置，您的文档站点将具备完整的多语言支持能力，为用户提供更友好的国际化访问体验。
