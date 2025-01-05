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
  -
    name: city walk 城市漫步
    desc: 致力于汇聚全国350多个城市的户外活动地点与文化场馆的开放数据平台。
    logo: https://pub-187e90a3327b41ccb8869558b6b8bbc0.r2.dev/city-shenzhen/2024/12/0a08e9417033ccaf116fb71cfc7bcdb9.png
    url: https://shenzhen.citywalk.group/
    repo: https://github.com/sunshang-hl/CityWalk
    preview: https://pub-187e90a3327b41ccb8869558b6b8bbc0.r2.dev/city-shenzhen/2024/12/ed251c4438f722dffd6cb95db86c0d56.jpg
  -
    name: 哦麦 MC
    desc: 我的世界教学文档。
    logo: https://static.ohmymc.com/img/minecraft-154749_1280.png?max_width=1920&max_height=1920
    url: https://ohmymc.com/
    preview: https://static.ohmymc.com/img/20241228225159139.png?max_width=1920&max_height=1920

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
    preview: https://www.dingyuqi.com/back-ground/site-home-page.png
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
  -
    name: IXYZ
    desc: Hi,there
    logo: https://ixyz.org/favicon.ico
    url: https://ixyz.org
    repo: https://github.com/ixyzorg
    preview: /images/demos/ixyz.org.jpg
  -
    name: AJohn
    desc: Never, ever, ever give up
    logo: https://cdn.jsdelivr.net/gh/zzyAJohn/Image/blog-favicon.png
    url: https://ajohn.top/
    repo: https://github.com/zzyAJohn
    preview: https://cdn.jsdelivr.net/gh/zzyAJohn/Image/blog-preview.png
  -
    name: Jiawei Wang
    desc: PLUS & WAVE!
    logo: https://plus-wave.github.io/icon/wave+.png
    url: https://plus-wave.github.io
    repo: https://github.com/PLUS-WAVE
    preview: https://raw.githubusercontent.com/PLUS-WAVE/blog-image/master/img/blog/2024-11-24/plus-wave.github.io.jpg
  -
    name: 小沐沐吖
    desc: 人生如棋，落子无悔；处世之道，贵在从容
    logo: https://blog.mu00.cn/logo.png
    url: https://blog.mu00.cn/
    repo: https://github.com/sunnyboy-mu/sunnyboy-blog
    preview: /images/demos/sunnyboy_mu.jpg
  -
    name: QiHuang02 的笔记本
    desc: 𝓔𝔁𝓹𝓮𝓻𝓲𝓮𝓷𝓬𝓮 𝓲𝓼 𝓽𝓱𝓮 𝓫𝓮𝓼𝓽 𝓽𝓮𝓪𝓬𝓱𝓮𝓻.
    logo: https://qihuang02.cn/favicon.svg
    url: https://qihuang02.cn/
    repo: https://github.com/QiHuang02/qihuang02.github.io
    preview: https://image.qihuang02.cn/file/1736003534894_yulantu.png
  -
    name: 𝕛𝕚𝕒𝕙𝕒𝕠'𝕤 𝕓𝕝𝕠𝕘
    desc: 近乎无限长的时间 近乎无限广的空间 而我们同时出现在一处 命运就是这样
    logo: https://s.hijh.top/head.png
    url: https://hijh.top/
    repo: https://github.com/oh-yey
    preview: https://s.hijh.top/demos/blog-preview.png
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
