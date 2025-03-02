---
pageLayout: home
config:
  -
    type: hero
    full: true
    background: tint-plate
    hero:
      name: Theme Plume
      tagline: VuePress Next Theme
      text: A simple, easy-to-use, feature-rich VuePress documentation & blog theme
      actions:
        -
          theme: brand
          text: Get Started →
          link: /en/guide/intro/
        -
          theme: alt
          text: Github
          link: https://github.com/pengzhanbo/vuepress-theme-plume
  -
    type: features
    features:
      -
        title: Responsive Layout
        icon: twemoji:laptop-computer
        details: Adapts to mobile devices, PCs, and tablets
      -
        title: Blog & Documentation
        icon: twemoji:open-book
        details: Whether you want to write a blog, product documentation, or both
      -
        title: Out-of-the-Box
        icon: twemoji:rocket
        details: Supports zero-configuration out-of-the-box, as well as rich customization options
      -
        title: Multi-language
        icon: twemoji:balance-scale
        details: Built-in support for Chinese/English, and you can customize and add more language support
      -
        title: Dual Color Theme
        icon: twemoji:cityscape
        details: Supports light/dark themes, including code highlighting
      -
        title: Plugins
        icon: twemoji:card-file-box
        details: Built-in rich plugins to meet general website needs
      -
        title: Search & Comments
        icon: twemoji:magnifying-glass-tilted-right
        details: Supports multiple comment systems, local search, and Algolia search
      -
        title: Encryption
        icon: twemoji:locked-with-key
        details: Supports full-site encryption and partial encryption (encrypted directories, encrypted articles)
      -
        title: Markdown Enhancement
        icon: twemoji:writing-hand-light-skin-tone
        details: Supports Markdown syntax, code block grouping, hint containers, task lists, mathematical formulas, code demonstrations, etc.
  -
    type: image-text
    title: Features
    description: Built-in rich features to meet general website needs.
    image: /images/plume-1.svg
    list:
      -
        title: Article Information
        description: Add tags, categories, word count, reading time, writing date, and other information to articles.
      -
        title: Comments
        description: Supports 4 comment systems： Giscus, Waline, Twikoo, Artalk<br>You can freely choose the comment system that suits your needs.
      -
        title: Search
        description: Supports local search based on minisearch, and also supports Algolia search.
      -
        title: Encryption
        description: Supports full-site encryption and partial encryption (encrypted directories, encrypted articles).
      -
        title: Code
        description: Code copying, CodePen demonstration, JSFiddle demonstration, CodeSandbox demonstration, code groups, line highlighting, line focusing, line warnings, difference comparison, code block folding, etc.
      -
        title: Resource Embedding
        description: Charts：chart.js/ECharts/Mermaid/flowchart<br>Videos：Bilibili/Youtube/ArtPlayer<br>PDF, 200K+ Iconify icons
  -
    type: text-image
    title: Blog
    description: The theme supports blogs by default, allowing you to create your personal blog.
    image: /images/plume-2.svg
    list:
      -
        title: Article List
        description: Automatically sorts and generates a blog article list page based on the article writing date.
      -
        title: Blogger Information
        description: Customize name, motto, avatar, and social media links.
      -
        title: Categories, Tags, Archives
        description: Automatically generates category pages, tag pages, and archives articles by year.
  -
    type: image-text
    title: Documentation
    image: /images/plume-3.svg
    description: The theme supports documentation by default, allowing you to create product documentation or organize your knowledge system.
    list:
      -
        title: Sidebar
        description: Automatically generates a sidebar based on the documentation directory, or you can manually configure it. The theme provides a simpler configuration method.
      -
        title: Documentation Classification
        description: You can categorize different documents into different directories for better management of the documentation structure.
  -
    type: custom
---

<div style="max-width: 960px;margin:0 auto;" class="home-custom-content">

::: center
![GitHub Repo stars](https://img.shields.io/github/stars/pengzhanbo/vuepress-theme-plume)
![npm version](https://img.shields.io/npm/v/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=npm)
![npm downloads](https://img.shields.io/npm/dm/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=downloads)
![npm downloads](https://img.shields.io/npm/dt/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=downloads)
![github license](https://img.shields.io/github/license/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A)

![peer dependency](https://img.shields.io/npm/dependency-version/vuepress-theme-plume/peer/vuepress?color=32A9C3&labelColor=1B3C4A)
![codecov](https://codecov.io/gh/pengzhanbo/vuepress-theme-plume/graph/badge.svg?token=W6KYBX7WO5)
:::

### Installation

:::code-tabs
@tab pnpm

```sh
pnpm add vuepress@next vuepress-theme-plume vue
```

@tab npm

```sh
npm install vuepress@next vuepress-theme-plume
```

@tab yarn

```sh
yarn add vuepress@next vuepress-theme-plume
```

:::

### Configuration

::: code-tabs
@tab .vuepress/config.ts

```ts :no-line-numbers
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // vuepress config...
  theme: plumeTheme({
    // theme config...
  })
})
```

:::

### Update Log

[Changelog](../changelog)

### Contributors

<Contributors
:contributors="[
'pengzhanbo',
{ github: 'huankong233', name: 'huan_kong' },
{ github: 'northword', name: 'Northword' },
'KrLite',
'shylock-wu',
'hrradev',
{ github: 'TheCoderAlex', name: 'Tang Zifeng' },
{ github: 'HydroGest', name: 'MarkChai' },
{ github: 'sunnyboy-mu', name: '小沐沐吖' },
{ github: 'zhenghaoyang24', name: 'zhenghaoyang24' },
]"
/>

</div>

<style>
.home-custom-content img {
  cursor: default !important;
}
</style>
