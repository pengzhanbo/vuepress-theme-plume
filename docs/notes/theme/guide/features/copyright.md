---
title: 文章版权所有
icon: lucide:creative-commons
createTime: 2024/11/20 10:52:49
permalink: /guide/features/copyright/
---

<script setup>
import VPCopyright from '@theme/VPCopyright.vue'
</script>

## 概述

主题支持为文章添加 文章 **版权所有** 声明。

文章通常来源于 原创、转载、翻译等。针对于不同的来源，添加版权声明信息能够更好地保护知识产权，
以及避免产生版权纠纷。

### Creative Commons

主题默认支持 [Creative Commons](https://creativecommons.org/) 许可协议的版权声明，包括:

<style>
.doc-cc-list [class^="vpi-license-"] {
  margin-left: 8px;
  width: 1.4em;
  height: 1.4em;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}
</style>

<div class="doc-cc-list">

- [CC0 1.0 通用 (CC0)](https://creativecommons.org/publicdomain/zero/1.0/)
  <span class="vpi-license-zero" />
- [署名 4.0 国际 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" />
- [署名-相同方式共享 4.0 国际 (CC-BY-SA-4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" /><span class="vpi-license-sa" />
- [署名-非商业性 4.0 国际 (CC-BY-NC-4.0)](https://creativecommons.org/licenses/by-nc/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" /><span class="vpi-license-nc" />
- [署名-禁止演绎 4.0 国际 (CC-BY-ND-4.0)](https://creativecommons.org/licenses/by-nd/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" /><span class="vpi-license-nd" />
- [署名-非商业性-相同方式共享 4.0 国际 (CC-BY-NC-SA-4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" /><span class="vpi-license-nc" /><span class="vpi-license-sa" />
- [署名-非商业性-禁止演绎 4.0 国际 (CC-BY-NC-ND-4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
  <span class="vpi-license-cc" /><span class="vpi-license-by" /><span class="vpi-license-nc" /><span class="vpi-license-nd" />

</div>

您可以根据需要选择不同的许可协议，或者自定义许可协议。

### 版权信息

版权信息包括：

- 版权所有者，版权所有者链接
- 版权许可证，版权许可证链接
- 作品原文链接

这些信息将显示在文章的底部。

::: tip 使用此功能建议同时启用 [贡献者](./contributors.md) 功能。对于原创文章，主题会自动将文章的第一位贡献者作为版权所有者。你也可以在文章 frontmatter 中手动指定版权所有者。
:::

## 全局配置

您可以通过以下配置为您的站点的所有文章，声明版权许可证为 `CC-BY-4.0`:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    copyright: 'CC-BY-4.0' // [!code hl]
  })
})
```

您可以通过以下配置为您的站点的所有文章 声明自定义的版权许可证:

```ts :no-line-numbers title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    copyright: { // [!code hl:6]
      license: {
        name: 'MIT', // 许可证名称
        url: 'https://your-license-url' // 许可证地址
      },
      author: {
        name: 'Your Name', // 版权所有者名称
        url: 'https://your-author-url' // 版权所有者地址
      },
      creation: 'reprint' // 创作方式
    }
  })
})
```

**配置类型：**

```ts
export type CopyrightLicense
  = | 'CC-BY-4.0'
    | 'CC-BY-SA-4.0'
    | 'CC-BY-NC-4.0'
    | 'CC-BY-NC-SA-4.0'
    | 'CC-BY-ND-4.0'
    | 'CC-BY-NC-ND-4.0'
    | 'CC0'
    | string

/**
 * - 配置为 `true` 时，默认为 `CC-BY-4.0`
 * - 配置为 `false` 时，不显示版权，但可以在文章 frontmatter.copyright 中覆盖配置
 */
type CopyrightOptions = boolean | string | CopyrightLicense | {
  /**
   * 版权许可证
   */
  license?: CopyrightLicense | {
    name: CopyrightLicense | string
    url: string
  }
  /**
   * 版权所有者，未配置时，默认从 git 提交记录中获取
   */
  author?: {
    name: string
    url?: string
  }
  /**
   * 创作方式，原创、翻译、转载
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'
}
```

::: warning 全局配置只适用于 原创文章，对于非原创文章，您应该在文章 frontmatter 中配置版权信息。
:::

## 文章 frontmatter 配置

您可以在文章 frontmatter 中为单个文章配置版权信息，以覆盖全局配置：

```md
---
title: 我的文章
copyright: CC-BY-4.0
---
```

**配置类型：**

```ts
/**
 * 配置为 `false` 时，不显示版权
 * 配置为 `true` 时，则默认为 全局配置的 copyright
 */
export type CopyrightFrontmatter = boolean | string | CopyrightLicense | {
  /**
   * 版权许可
   */
  license?: CopyrightLicense | { name: string, url: string }

  /**
   * 版权所有者
   * - 原创文章时默认为文章的第一位贡献者
   * - 非原创文章时需要声明版权所有者
   */
  author?: string | { name: string, url?: string }

  /**
   * 作品的创作方式, 原创、翻译、转载
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'

  /**
   * 原文地址，非原创作品时需要声明原文地址
   * @default ''
   */
  source?: string
}
```

## 文章配置示例

### 原创文章

```md
---
title: 我的文章
copyright: CC-BY-4.0
---
```

<VPCopyright license="CC-BY-4.0" />

### 转载文章

```md
---
title: 转载的文章
copyright:
  creation: reprint
  license: CC-BY-4.0
  source: https://example.com/origin
  author:
    name: 转载者
    url: https://example.com/author
---
```

<VPCopyright
  license="CC-BY-4.0" source="https://example.com/origin" creation="reprint"
  :author="{name: '转载者', url: 'https://example.com/author'}"
/>

### 翻译文章

```md
---
title: 翻译的文章
copyright:
  creation: translate
  license: CC-BY-4.0
  source: https://example.com/origin
  author:
    name: 原文作者
    url: https://example.com/author
---
```

<VPCopyright
  license="CC-BY-4.0" source="https://example.com/origin" creation="translate"
  :author="{name: '原文作者', url: 'https://example.com/author'}"
/>

### 自定义许可证

```md
---
title: 我的文章
copyright:
  license:
    name: MIT
    url: https://example.com/mit
---
```

<VPCopyright :license="{name: 'MIT', url: 'https://example.com/mit'}" />
