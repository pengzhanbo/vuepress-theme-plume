---
title: 多语言配置
createTime: 2024/03/02 10:07:15
permalink: /config/locales/
---

这些选项用于配置与语言相关的文本。

如果你的站点是以非内置语言支持以外的其他语言提供服务的，你应该为每个语言设置这些选项来提供翻译。

## 内置语言支持

主题内置了以下语言支持，包括:

- 简体中文 (`zh-CN`) - `/zh/`
- 繁体中文 (`zh-TW`) - `/zh-tw/`
- 英语 (`en-US`) - `/en/`
- 法语 (`fr-FR`) - `/fr/`
- 德语 (`de-DE`) - `/de/`
- 俄语 (`ru-RU`) - `/ru/`
- 日语 (`ja-JP`) - `/ja/`

## 配置

您应该将配置写入到 `theme.locales` 中。

您可以在 `.vuepress/config.ts` ，或者在 `.vuepress/plume.config.ts` 中进行配置：

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      // 非内置语言的语言代码
      '/xxx/': {
        // 语言配置
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    // 非内置语言的语言代码
    '/xxx/': {
      // 语言配置
    }
  }
})
```

:::

详细配置方法请参考：[国际化](../guide/quick-start/locales.md)

### appearanceText

- 类型： `string`
- 默认值： `'Appearance'`
- 详情： 导航栏中的主题切换按钮的文本。

### selectLanguageName

- 类型： `string`
- 默认值： `''`
- 详情：

  Locale 的语言名称。

  该配置项 **仅能在主题配置的 [locales](./theme.md#locales) 的内部生效** 。它将被用作 locale 的语言名称，展示在 _选择语言菜单_ 内。

### selectLanguageText

- 类型： `string`
- 默认值： `''`
- 详情：

  _选择语言菜单_ 的文本。

  如果你在站点配置中设置了多个 [locales](./theme.md#locales) ，那么 _选择语言菜单_ 就会显示在导航栏中仓库按钮的旁边。

### selectLanguageAriaLabel

- 类型： `string`
- 默认值： `''`
- 详情：

   _选择语言菜单 的 `aria-label` 属性。_

   它主要是为了站点的可访问性 (a11y) 。

### homeText

- 类型： `string`
- 默认值： `'Home'`
- 详情： 主页链接的文本。

  - 主题默认导航栏中的首页链接的文本。
  - 面包屑导航中的首页链接的文本。

### blogText

- 类型： `string`
- 默认值： `'Blog'`
- 详情： 博客链接的文本。

  - 主题默认导航栏中的博客链接的文本。
  - 面包屑导航中的博客链接的文本。

### tagText

- 类型： `string`
- 默认值： `'Tags'`
- 详情： 标签链接的文本。

  - 主题默认导航栏中的标签链接的文本。
  - 博客页中的标签链接的文本。
  - 博客标签页中的标题。

### categoryText

- 类型： `string`
- 默认值： `'Categories'`
- 详情： 分类链接的文本。

  - 主题默认导航栏中的分类链接的文本。
  - 博客页中的分类链接的文本。
  - 博客分类页中的标题。

### archiveText

- 类型： `string`
- 默认值： `'Archives'`
- 详情： 归档链接的文本。

  - 主题默认导航栏中的归档链接的文本。
  - 博客页中的归档链接的文本。
  - 博客归档页中的标题。

### archiveTotalText

- 类型： `string`
- 默认值： `'{count} articles'`
- 详情： 归档页中的总文章数的文本。

### sidebarMenuLabel

- 类型： `string`
- 默认值： `'Menu'`
- 详情：

  移动设备下的导航栏中 菜单选项的文本。

### returnToTopLabel

- 类型： `string`
- 默认值： `'return to top'`
- 详情：

  移动设备下的导航栏中返回顶部的文本。

### outlineLabel

- 类型： `string`
- 默认值： `'On this page'`
- 详情：

  移动设备下的导航栏中大纲标题的文本

### editLinkText

- 类型： `string`
- 默认值： `'Edit this page'`
- 详情： 编辑链接文本

### latestUpdatedText

- 类型： `string`
- 默认值： `'Latest Updated'`
- 详情： 最近更新时间 的文本

### contributorsText

- 类型： `string`
- 默认值： `'Contributors'`
- 详情： 贡献者的文本

### changelogText

- 类型： `string`
- 默认值： `'Changelog'`
- 详情： 变更记录的文本

### changelogOnText

- 类型： `string`
- 默认值： `'On'`
- 详情： 单次变更记录的时间文本

### changelogButtonText

- 类型： `string`
- 默认值： `'View All Changelog'`
- 详情： 变更记录的按钮文本

### copyrightText

- 类型： `string`
- 默认值： `'Copyright'`
- 详情： 版权所有的文本

### copyrightAuthorText

- 类型： `string`
- 默认值： `'Copyright Ownership:'`
- 详情： 版权所有者的文本

### copyrightCreationOriginalText

- 类型： `string`
- 默认值： `'This article link:'`
- 详情： 本文链接的文本

### copyrightCreationTranslateText

- 类型： `string`
- 默认值： `'This article translated from:'`
- 详情： 本文翻译的文本

### copyrightCreationReprintText

- 类型： `string`
- 默认值： `'This article reprint from:'`
- 详情： 本文转载的文本

### copyrightLicenseText

- 类型： `string`
- 默认值： `'License under:'`
- 详情： 版权许可证的文本

### prevPageLabel

- 类型： `string`
- 默认值： `'Previous Page'`
- 详情： 上一页的文本

### nextPageLabel

- 类型： `string`
- 默认值： `'Next Page'`
- 详情： 下一页的文本

### notFound

- 类型： `NotFound | undefined`
- 默认值： `undefined`
- 详情： 404 页面配置

```ts
interface NotFound {
  code?: string
  title?: string
  quote?: string
  linkLabel?: string
  linkText?: string
}
```
