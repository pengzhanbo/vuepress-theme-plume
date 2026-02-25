---
url: /config/plugins/llmstxt/index.md
---
## 概述

为站点添加 [llms.txt](https://llmstxt.org/)，以提供对 LLM 友好的内容。

**关联插件**： [@vuepress/plugin-llms](https://ecosystem.vuejs.press/zh/plugins/ai/llms.html)

## 为什么需要 llms.txt？

大型语言模型越来越依赖网站信息，但面临一个关键限制：上下文窗口太小，无法完整处理大多数网站。将包含导航、广告和 JavaScript 的复杂 HTML 页面转换为适合 LLM 的纯文本既困难又不精确。

虽然网站同时为人类读者和 LLM 服务，但后者受益于在一个可访问的位置收集的更简洁、专家级的信息。这对于开发环境等使用案例尤其重要，因为 LLM 需要快速访问编程文档和 API。

向网站添加 `/llms.txt` Markdown 文件，以提供对 LLM 友好的内容。此文件提供了简短的背景信息、指南和指向详细 Markdown 文件的链接。

## 功能

插件通过检索你的文档源目录中的所有 Markdown 文件，并将其转换为 LLM 友好的纯文本文件。

::: file-tree

* .vuepress/dist
  * llms.txt
  * llms-full.txt
  * markdown-examples.html
  * markdown-examples.md
  * …
    :::

点击以下链接查看本文档站点的 llms.txt 文件：

* [llms.txt](/llms.txt){.no-icon}
* [llms-full.txt](/llms-full.txt){.no-icon}

::: tip
插件仅在生产构建时，即执行 `vuepress build` 命令时，生成 `llms.txt` 文件，以及其它 LLM 友好的文档文件，并将它们输出到 `.vuepress/dist` 目录中。

:::

[完整功能说明请查看 **插件官方文档**](https://ecosystem.vuejs.press/zh/plugins/ai/llms.html#%E6%8F%92%E4%BB%B6%E5%8A%9F%E8%83%BD){.read-more}

## 配置

主题默认不启用此功能，你可以通过 `llmstxt` 配置项启用它：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 使用主题内置的默认配置
    // llmstxt: true,

    // 使用自定义配置
    llmstxt: {
      locale: '/',
      // ...其它配置
    },

    // 也可以在 `plugins.llmstxt` 配置，但不推荐
    plugins: {
      llmstxt: true
    }
  }),
})
```

[完整配置项说明请查看 **插件官方文档**](https://ecosystem.vuejs.press/zh/plugins/ai/llms.html#options){.read-more}

## 组件

为进一步增强 文档站点 与 LLMs 的互动，你可以在文档站点中添加 `<PageContextMenu />` 组件。
该组件不作为内置组件，而是主题额外的 `features` 实现，因此你需要手动引入它，
并在合适的位置，通过 [组件插槽](../../guide/custom/slots.md) 添加到文档站点中：

```ts title=".vuepress/client.ts"
import { defineAsyncComponent, h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import PageContextMenu from 'vuepress-theme-plume/features/PageContextMenu.vue' // [!code ++]
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  layouts: {
    Layout: h(Layout, null, {
      // 将 PageContextMenu 添加到 doc-title-after 插槽，即文章标题的右侧
      'doc-title-after': () => h(PageContextMenu), // [!code ++]
    }),
  },
})
```

你可以在当前页面的标题的右侧，体验该组件的功能。

::: important
此组件完全依赖于 `@vuepress/plugin-llms` 插件，仅当你启用了此插件功能后，才能使用它。

因此，此组件提供的功能 **仅在构建后的生产包中才可用** 。
:::
