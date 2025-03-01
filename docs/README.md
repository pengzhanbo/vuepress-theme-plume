---
pageLayout: home
config:
  -
    type: hero
    full: true
    background: tint-plate
    hero:
      name: Hi There!
      tagline: 你好，我是 Modenc
      text: |
        <p style="font-size: 1.2rem; line-height: 1.6rem">文字是点点墨色坠入了砚池，凝成夏花与飞鸟；亦是竹杖芒鞋漏下的月华，照彻长夜与拂晓。</p>
      actions:
        -
          # theme: brand
          text: 浏览 Blog →
          link: /blog/
        -
          # theme: brand
          text: 知识库 & 笔记 →
          link: /notes/index/
        -
          theme: alt
          text: Github
          link: https://github.com/pengzhanbo/vuepress-theme-plume
#   -
#     type: features
#     features:
#       -
#         title: 响应式布局
#         icon: twemoji:laptop-computer
#         details: 适配移动设备，PC，平板
#       -
#         title: 博客 & 文档
#         icon: twemoji:open-book
#         details: 无论是想写博客，或想写产品文档，或者两者兼顾
#       -
#         title: 开箱即用
#         icon: twemoji:rocket
#         details: 支持零配置开箱即用，也支持丰富的自定义配置
#       -
#         title: 多语言
#         icon: twemoji:balance-scale
#         details: 内置 中文/英文支持，还可以自定义添加更多的语言支持
#       -
#         title: 双色主题
#         icon: twemoji:cityscape
#         details: 支持 浅色/深色 主题，包括代码高亮
#       -
#         title: 插件
#         icon: twemoji:card-file-box
#         details: 内置丰富的插件，一站式解决网站一般需求
#       -
#         title: 搜索、评论
#         icon: twemoji:magnifying-glass-tilted-right
#         details: 支持多种评论系统，支持本地搜索、Algolia搜索
#       -
#         title: 加密
#         icon: twemoji:locked-with-key
#         details: 支持全站加密、部分加密（加密目录、加密文章）
#       -
#         title: Markdown 增强
#         icon: twemoji:writing-hand-light-skin-tone
#         details: 支持 Markdown 语法，支持 代码块分组、提示容器、任务列表、数学公式、代码演示等
  # -
  #   type: image-text
  #   title: 功能
  #   description: 内置丰富的功能，满足网站一般需求。
  #   image: /images/plume-1.svg
  #   list:
  #     -
  #       title: 文章信息
  #       description: 为文章添加标签、分类、字数统计、阅读时间、写作日期等信息。
  #     -
  #       title: 评论
  #       description: 支持 4 种评论系统：Giscus、Waline、Twikoo、Artalk<br>你可以自由选择符合你的需求的评论系统。
  #     -
  #       title: 搜索
  #       description: 支持基于 minisearch 的本地搜索，还支持接入 Algolia 搜索。
  #     -
  #       title: 加密
  #       description: 支持全站加密、部分加密（加密目录、加密文章）。
  #     -
  #       title: 代码
  #       description: 代码复制，CodePen演示，JSFiddle演示，CodeSandbox演示，代码组，行高亮，行聚焦，行警告，差异对比，代码块折叠等。
  #     -
  #       title: 资源嵌入
  #       description: 图表：chart.js/ECharts/Mermaid/flowchart<br>视频：Bilibili/Youtube/ArtPlayer<br>PDF，200K+ Iconify 图标
  # -
  #   type: text-image
  #   title: 博客
  #   description: 主题默认支持博客，生成你的个人博客。
  #   image: /images/plume-2.svg
  #   list:
  #     -
  #       title: 文章列表
  #       description: 通过文章写作日期，自动排序并生成博客文章列表页。
  #     -
  #       title: 博主信息
  #       description: 自定义名称、座右铭、头像，社交媒体链接。
  #     -
  #       title: 分类、标签、归档
  #       description: 自动生成分类页、标签页，为文章根据年份进行归档。
  # -
  #   type: image-text
  #   title: 文档
  #   image: /images/plume-3.svg
  #   description: 主题默认支持文档，生成你的产品文档，或归纳你的知识体系。
  #   list:
  #     -
  #       title: 侧边栏
  #       description: 根据文档目录自动生成侧边栏，也可以手动配置，主题提供了更简单的配置方式。
  #     -
  #       title: 文档分类归纳
  #       description: 可以文档的不同，归纳到不同的目录，更好的管理文档结构。
  # -
  #   type: custom
  - type: Countdown
  -
    type: blog
---
<div class="main-container">
<div class="title">距离2025年高考还有</div>

<Card>{{  new Date("2025-06-07") - new Date() }}</Card>
</div>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 3rem;
  line-height: 3rem;
  text-align: right;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'

</script>
