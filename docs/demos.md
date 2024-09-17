---
title: 案例
author: pengzhanbo
createTime: 2024/04/18 19:22:07
permalink: /demos/
readingTime: false
prev: false
next: false
draft: true
externalLinkIcon: false
docs:
  -
    name: VuePress Plume
    desc: 一个简约的，功能丰富的 vuepress 文档&博客 主题。
    logo: /plume.png
    url: https://plume.pengzhanbo.cn
    repo: https://github.com/pengzhanbo/vuepress-theme-plume
    preview: /images/demos/plume.png
blog:
  -
    name: 鹏展博
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
    logo: https://pengzhanbo.cn/images/blogger-fav.png
    url: https://pengzhanbo.cn/
    repo: https://github.com/pengzhanbo/pengzhanbo.cn
    preview: /images/demos/pengzhanbo.png
  -
    name: 二猫子
    desc: 老老实实的二猫子，从不胡说八道
    logo: https://www.ermao.net/images/logo.svg
    url: https://www.ermao.net/
    repo: https://github.com/ermaozi
    preview: /images/demos/ermao.net.png
---

:::important
你可以随时通过 [PR](https://github.com/pengzhanbo/vuepress-theme-plume/edit/main/docs/demos.md) 添加你的 文档 或 博客 到这个页面。

站点预览图片请放到 `docs/.vuepress/public/images/demos` 目录下。推荐使用远程链接，以便可以随时更新它。
:::

## 文档

<Demos :list="$frontmatter.docs" />

## 博客

<Demos :list="$frontmatter.blog" />
