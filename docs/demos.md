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
contributors: false
changelog: false
docs:
  -
    name: VuePress Plume
    desc: 一个简约的，功能丰富的 vuepress 文档&博客 主题。
    logo: /plume.png
    url: https://theme-plume.vuejs.press
    repo: https://github.com/pengzhanbo/vuepress-theme-plume
    preview: /images/demos/plume.jpg
blog:
  -
    name: 鹏展博
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
    logo: https://pengzhanbo.cn/images/blogger-fav.png
    url: https://pengzhanbo.cn/
    repo: https://github.com/pengzhanbo/pengzhanbo.cn
    preview: /images/demos/pengzhanbo.jpg
  -
    name: 二猫子
    desc: 老老实实的二猫子，从不胡说八道
    logo: https://www.ermao.net/images/logo.svg
    url: https://www.ermao.net/
    repo: https://github.com/ermaozi
    preview: /images/demos/ermao.net.png
  -
    name: Keep It Simple
    desc: 如无必要, 勿增实体
    logo: https://www.dingyuqi.com/icon/icon.ico
    url: https://dingyuqi.com
    repo: https://github.com/dingyuqi
    preview: /images/demos/dingyuqi.com.jpg
  -
    name: 屠永涛
    desc: 大脑中走得越远，现实中走得越稳！
    logo: http://tuyongtao.top/fettjob/imgs/head.jpg
    url: http://tuyongtao.top/fettjob/
    repo: https://github.com/tuyongtao-T
    preview: /images/demos/tuyongtao.top.jpeg
  -
    name: Hoey
    desc: 老师,我太想进步了。
    logo: https://hoeyzheng.top/avatar.jpg
    url: https://hoeyzheng.top
    repo: https://github.com/zhenghaoyang24
    preview: /images/demos/hoeyzheng.top.jpg
---

:::important
你可以随时通过 [PR](https://github.com/pengzhanbo/vuepress-theme-plume/edit/main/docs/demos.md) 添加你的 文档 或 博客 到这个页面。

站点预览图片请放到 `docs/.vuepress/public/images/demos` 目录下。推荐使用远程链接，以便可以随时更新它。

图片请尽量使用 `.jpg` 格式，体积较大的请使用 [tinypng](https://tinypng.com/) 进行压缩。
:::

## 文档

<Demos :list="$frontmatter.docs" />

## 博客

<Demos :list="$frontmatter.blog" />
