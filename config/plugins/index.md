---
url: /config/plugins/index.md
---
主题内置的使用的插件，扩展了主题的众多功能，你可以在 `plugins` 配置中， 实现对内部使用的各个插件的自定义配置。

## 配置

所有主题内部使用的插件， 均在 `plugins` 字段中进行配置。

```js title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      // more options...  // [!code ++]
    }
  }),
})
```

## 插件列表

* [@vuepress/plugin-nprogress](https://ecosystem.vuejs.press/zh/plugins/features/nprogress.html) - 页面加载进度条
* [@vuepress/plugin-photo-swipe](https://ecosystem.vuejs.press/zh/plugins/features/photo-swipe.html) - 图片预览
* [@vuepress/plugin-reading-time](https://ecosystem.vuejs.press/zh/plugins/development/reading-time.html) - 文章阅读时间
* [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html) - 文章水印
* [@vuepress-plume/plugin-search](./search.md) - 本地搜索
* [@vuepress/plugin-docsearch](https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html) - Algolia 文档搜索
* [@vuepress/plugin-copy-code](https://ecosystem.vuejs.press/zh/plugins/features/copy-code.html) - 代码复制
* [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html) - 代码高亮
* [@vuepress/plugin-comment](https://ecosystem.vuejs.press/zh/plugins/blog/comment/) - 文章评论
* [@vuepress/plugin-markdown-hint](https://ecosystem.vuejs.press/zh/plugins/markdown/hint.html) - Markdown 提示
* [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/image.html) - Markdown 图片
* [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/math.html) - Markdown 数学公式
* [@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/zh/plugins/markdown/include.html) - Markdown 导入文件
* [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-chart/) - Markdown 图表
  chartjs / echarts / mermaid / flowchart / markmap / plantUML
* [@vuepress/plugin-replace-assets](https://ecosystem.vuejs.press/zh/plugins/tools/replace-assets.html) - 资源链接替换
* [vuepress-plugin-md-power](./markdown-power.md) - Markdown Power
* [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) - git 提交信息
* [@vuepress/plugin-cache](https://ecosystem.vuejs.press/zh/plugins/tools/cache.html) - 页面编译缓存
* [@vuepress/plugin-seo](https://ecosystem.vuejs.press/zh/plugins/seo/seo/) - SEO 优化
* [@vuepress/plugin-sitemap](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/) - 站点地图

:::tip
您无需重复安装这些内置插件，也无需在 [vuepress配置 > plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins) 中添加它们。主题已在内部完成了这些工作。
:::
