<p align="center">
<img src="/docs/plume.svg" width="200px" />
</p>

<h2 align="center">vuepress-theme-plume</h2>

[![npm version](https://img.shields.io/npm/v/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=npm)](https://www.npmjs.com/package/vuepress-theme-plume)
[![npm download](https://img.shields.io/npm/dy/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=downloads)](https://www.npmjs.com/package/vuepress-theme-plume)
![GitHub License](https://img.shields.io/github/license/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A)
<!-- [![npm beta download](https://img.shields.io/npm/dt/@vuepress-plume/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=beta%20downloads)](https://www.npmjs.com/package/vuepress-theme-plume) -->

一个简约的，干净的，容易上手的 vuepress 主题，适用于博客和文档。

开箱即用，仅需少量配置即可使用，让您更专注于 内容的创作，更好的表达你的想法，形成你的知识笔记。

内置了丰富的强大的功能，旨在让内容更具有表现力。

### [查看文档](https://pengzhanbo.cn/note/vuepress-theme-plume)

## Install

``` sh
npm install vuepress@next vuepress-theme-plume
# or
pnpm add vuepress@next vuepress-theme-plume vue
# or
yarn add vuepress@next vuepress-theme-plume
```

## Usage

``` ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // vuepress config...
  theme: plumeTheme({
    // theme config...
  })
})
```

### `plumeTheme(options)`

__options__ : `PlumeThemeOptions`

[查看 options 详细说明](https://pengzhanbo.cn/note/vuepress-theme-plume/theme-config/)

## 案例

- [我的个人博客](https://pengzhanbo.cn/)

## 内置插件

- [plugin-shikiji](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-shikiji) 使用 [`shikiji`](https://shikiji.netlify.app/) 来为 Markdown 代码块启用代码高亮。
- [plugin-caniuse](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-caniuse) 在文档中使用 caniuse 提供的 web feature support list
- [plugin-auto-frontmatter](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-auto-frontmatter) 在 md 文件中根据匹配规则自动生成 frontmatter
- [plugin-notes-data](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-notes-data) 根据规则，将 md文件归类为 note，并生成 sidebar
- [plugin-blog-data](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-blog-data) 根据规则，将md文件归类为 blog post，并生成 post list
- [vuepress-plugin-mdEnhance](https://vuepress-theme-hope.github.io/v2/md-enhance/zh/) 增强markdown功能插件
- [vuepress-plugin-comment](https://vuepress-theme-hope.github.io/v2/comment/zh/) 文章评论插件，支持 "giscus" | "twikoo" | "waline"
- [vuepress-plugin-copy-code](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-copy-code) 文章内代码块复制插件
- [vuepress-plugin-medium-zoom](https://v2.vuepress.vuejs.org/zh/reference/plugin/medium-zoom.html) 图片预览插件
- [vuepress-plugin-search](https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html) 内容搜索插件
- [vuepress-plugin-docsearch](https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html) Algolia docsearch 内容搜索插件
- [vuepress-plugin-palette](https://v2.vuepress.vuejs.org/zh/reference/plugin/palette.html) 主题调色板插件
- [vuepress-plugin-seo](https://vuepress-theme-hope.github.io/v2/seo/zh/) seo 插件
- [vuepress-plugin-sitemap](https://vuepress-theme-hope.github.io/v2/sitemap/zh/) 生成sitemap 插件

## 非内置插件

- [vuepress-plugin-netlify-functions](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-netlify-functions) 当站点部署在 netlify 时，希望使用 netlify functions 可选择此插件提供支持

### 注意

本主题基于 `vuepress 2` ，处于 RC 阶段。

这意味着功能已趋于稳定，但在未来仍有小概率发生破坏性更改。

## 贡献指南

查看 [[贡献指南]](/CONTRIBUTING.md) 了解更多

### 效果图

**home page**

![](/docs/preview-home.jpeg)

**blog page**

![](/docs/preview-blog.jpeg?t=1)

**post page**

![](/docs/preview-post.jpeg)

**note page**

![](/docs/preview-note.jpeg)
