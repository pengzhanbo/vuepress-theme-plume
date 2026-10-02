---
url: /config/locales/index.md
---
这些选项用于配置与语言相关的文本。

如果您的站点是以非内置语言支持以外的其他语言提供服务的，您应该为每个语言设置这些选项来提供翻译。

## 内置语言支持

主题内置了以下语言支持，包括:

* 简体中文 (`zh-CN`) - `/zh/`
* 繁体中文 (`zh-TW`) - `/zh-tw/`
* 英语 (`en-US`) - `/en/`
* 法语 (`fr-FR`) - `/fr/`
* 德语 (`de-DE`) - `/de/`
* 俄语 (`ru-RU`) - `/ru/`
* 日语 (`ja-JP`) - `/ja/`
* 韩语 (`ko-KR`) - `/ko/`

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

## 路径映射

以下是一个多语言站点的目录结构与 URL 路径映射示例：

假设配置如下：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        selectLanguageName: '简体中文',
      },
      '/en/': {
        selectLanguageName: 'English',
      },
    },
  }),
})
```

对应的目录结构和 URL 映射如下：

::: file-tree

* docs/
  * README.md  <-- 访问 `/`  (中文首页)
  * guide/
    * intro.md  <-- 访问 `/guide/intro.html`
  * en/
    * README.md  <-- 访问 `/en/`  (英文首页)
    * guide/
      * intro.md  <-- 访问 `/en/guide/intro.html`
  * .vuepress/
    * config.ts
    * plume.config.ts

:::

**要点说明：**

* `locales` 对象的 `key`（如 `/` 和 `/en/`）决定了 URL 路径前缀
* 中文（默认语言）使用 `/` 作为前缀，对应 `docs/` 根目录下的文件
* 英文使用 `/en/` 作为前缀，对应 `docs/en/` 目录下的文件
* 每种语言的 Markdown 文件结构在该语言的目录下保持一致
* `.vuepress/` 目录是共享的配置目录，不需要为每种语言单独配置

### appearanceText

* 类型： `string`
* 默认值： `'Appearance'`
* 详情： 导航栏中的主题切换按钮的文本。

### selectLanguageName

* 类型： `string`
* 默认值： `''`
* 详情：

  Locale 的语言名称。

  该配置项 **仅能在主题配置的 [locales](./theme.md#locales) 的内部生效** 。它将被用作 locale 的语言名称，展示在 *选择语言菜单* 内。

### selectLanguageText

* 类型： `string`
* 默认值： `''`
* 详情：

  *选择语言菜单* 的文本。

  如果你在站点配置中设置了多个 [locales](./theme.md#locales) ，那么 *选择语言菜单* 就会显示在导航栏中仓库按钮的旁边。

### selectLanguageAriaLabel

* 类型： `string`
* 默认值： `''`
* 详情：

  *选择语言菜单 的 `aria-label` 属性。*

  它主要是为了站点的可访问性 (a11y) 。

### homeText

* 类型： `string`
* 默认值： `'Home'`
* 详情： 主页链接的文本。

  * 主题默认导航栏中的首页链接的文本。
  * 面包屑导航中的首页链接的文本。

### postsText

* 类型： `string`
* 默认值： `'Posts'`
* 详情： 文章列表页链接的文本。

  * 主题默认导航栏中的文章列表页链接的文本。
  * 面包屑导航中的文章列表页链接的文本。

### tagText

* 类型： `string`
* 默认值： `'Tags'`
* 详情： 标签链接的文本。

  * 主题默认导航栏中的标签链接的文本。
  * 博客页中的标签链接的文本。
  * 博客标签页中的标题。

### categoryText

* 类型： `string`
* 默认值： `'Categories'`
* 详情： 分类链接的文本。

  * 主题默认导航栏中的分类链接的文本。
  * 博客页中的分类链接的文本。
  * 博客分类页中的标题。

### archiveText

* 类型： `string`
* 默认值： `'Archives'`
* 详情： 归档链接的文本。

  * 主题默认导航栏中的归档链接的文本。
  * 博客页中的归档链接的文本。
  * 博客归档页中的标题。

### archiveTotalText

* 类型： `string`
* 默认值： `'{count} articles'`
* 详情： 归档页中的总文章数的文本。

### sidebarMenuLabel

* 类型： `string`
* 默认值： `'Menu'`
* 详情：

  移动设备下的导航栏中 菜单选项的文本。

### returnToTopLabel

* 类型： `string`
* 默认值： `'return to top'`
* 详情：

  移动设备下的导航栏中返回顶部的文本。

### outlineLabel

* 类型： `string`
* 默认值： `'On this page'`
* 详情：

  移动设备下的导航栏中大纲标题的文本

### editLinkText

* 类型： `string`
* 默认值： `'Edit this page'`
* 详情： 编辑链接文本

### latestUpdatedText

* 类型： `string`
* 默认值： `'Latest Updated'`
* 详情： 最近更新时间 的文本

### contributorsText

* 类型： `string`
* 默认值： `'Contributors'`
* 详情： 贡献者的文本

### changelogText

* 类型： `string`
* 默认值： `'Changelog'`
* 详情： 变更记录的文本

### changelogOnText

* 类型： `string`
* 默认值： `'On'`
* 详情： 单次变更记录的时间文本

### changelogButtonText

* 类型： `string`
* 默认值： `'View All Changelog'`
* 详情： 变更记录的按钮文本

### copyrightText

* 类型： `string`
* 默认值： `'Copyright'`
* 详情： 版权所有的文本

### copyrightAuthorText

* 类型： `string`
* 默认值： `'Copyright Ownership:'`
* 详情： 版权所有者的文本

### copyrightCreationOriginalText

* 类型： `string`
* 默认值： `'This article link:'`
* 详情： 本文链接的文本

### copyrightCreationTranslateText

* 类型： `string`
* 默认值： `'This article translated from:'`
* 详情： 本文翻译的文本

### copyrightCreationReprintText

* 类型： `string`
* 默认值： `'This article reprint from:'`
* 详情： 本文转载的文本

### copyrightLicenseText

* 类型： `string`
* 默认值： `'License under:'`
* 详情： 版权许可证的文本

### prevPageLabel

* 类型： `string`
* 默认值： `'Previous Page'`
* 详情： 上一页的文本

### nextPageLabel

* 类型： `string`
* 默认值： `'Next Page'`
* 详情： 下一页的文本

### notFound

* 类型： `NotFound | undefined`
* 默认值： `undefined`
* 详情： 404 页面配置

```ts
interface NotFound {
  code?: string
  title?: string
  quote?: string
  linkLabel?: string
  linkText?: string
}
```

## 加密相关文本

以下选项用于自定义加密功能中显示的文本，应配置在 `theme.locales` 中。详见 [加密功能](../guide/features/encryption.md)。

### encryptGlobalText

* 类型： `string`
* 默认值： `'Only password can access this site'`
* 详情：

  全站加密时，提示信息。支持 HTML。如果你期望为访客提供获取密码的联系方式，你可能会需要这个配置。

### encryptPageText

* 类型： `string`
* 默认值： `'Only password can access this page'`
* 详情：

  部分加密时，提示信息。支持 HTML。如果你期望为访客提供获取密码的联系方式，你可能会需要这个配置。

### encryptButtonText

* 类型： `string`
* 默认值： `'Confirm'`
* 详情： 确认按钮的文本

### encryptPlaceholder

* 类型： `string`
* 默认值： `'Enter password'`
* 详情： 密码输入框的占位符

### 配置示例

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        encryptButtonText: 'Confirm',
        encryptPlaceholder: 'Enter password',
        encryptGlobalText: 'Only password can access this site',
        encryptPageText: 'Only password can access this page',
      }
    }
  })
})
```
