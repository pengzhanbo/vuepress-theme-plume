---
url: /article/yw0dmwcm/index.md
---
**在本次更新中，主题移除了 `vuepress-plugin-md-enhance` 插件。**

由该插件提供支持的 图表 `Chartjs` `ECharts` `mermaid` `flowchart` `plantuml` 功能，迁移到
`@vuepress/plugin-markdown-chart` 插件。

因此主题也同步完成了插件的迁移。

至此，在主题中，由 `vuepress-plugin-md-enhance` 插件提供的相关功能，已全部迁移至官方 `vuepress/ecosystem`
仓库的相关插件。因此主题将从 `1.0.0-rc.154` 开始，安全的移除 `vuepress-plugin-md-enhance` 插件。

受此影响，如果你在 `.vuepress/client.ts` 中，有使用从 `vuepress-plugin-md-enhance` 导入的功能：

```ts title=".vuepress/client.ts"
import { defineMermaidConfig } from 'vuepress-plugin-md-enhance/client'

defineMermaidConfig({
  theme: 'dark'
})
```

需要进行修改：

```ts title=".vuepress/client.ts"
import { defineMermaidConfig } from '@vuepress/plugin-markdown-chart/client' // [!code ++]
import { defineMermaidConfig } from 'vuepress-plugin-md-enhance/client' // [!code --]

defineMermaidConfig({
  theme: 'dark'
})
```

如果您有在 `.vuepress/config.ts` 的主题配置中，使用 `plugins.mdEnhance` 配置，需要进行修改:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      mdEnhance: {
        mermaid: true,
        chartjs: true,
        // ...
      }
    }
  })
})
```

需要进行修改:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      mdEnhance: { // [!code --:5]
        mermaid: true,
        chartjs: true,
        // ...
      }
    },
    markdown: { // [!code ++:5]
      mermaid: true,
      chartjs: true,
      // ...
    }
  })
})
```

**如果您在使用过程中遇到问题，请在 [GitHub Issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues) 上反馈。**
