# vuepress-theme-plume

一款基于 [vuepress@next](https://github.com/vuepress/vuepress-next) 制作的简单的博客皮肤。

## 安装
``` sh
npm i @pengzhanbo/vuepress-theme-plume
# or yarn
yarn add @pengzhanbo/vuepress-theme-plume
```

## 特性
- 低配置化，仅需少量的vuepress配置即可使用
- 通过目录约定生成栏目

## 配置
``` js
// vuepress.config.{js, ts}
// or {sourceDir}/.vuepress/config.{js, ts}
export default {
  // ...
  theme: '@pengzhanbo/vuepress-theme-plume',
  themeConfig: {
    // 首页头部大图
    bannerImg: '/big-banner.jpg',
    // 博主头像
    avatarUrl: '/avatar.gif',
    // 博主名称
    avatar: '未闻花名',
    github: 'https://github.com/',
    email: '_@outlook.com',
    description: '学习，生活，娱乐，我全都要',
  },
}
```

## 编写文章

在你的文档目录下，首先创建一个 `README.md` 文件
```
---
home: true
---
```

然后，创建其他的目录，格式如下
``` sh
\d+\.[^]+
```
比如:  `1.前端`， `2.web` 的形式
主题会解析目录名称，分解为`{ type, name }` 的形式，并根据 type作为排序的依据。
再在目录中创建并编写文章即可。

建议首先启动 vuepress 本地开发环境后，再创建新文章

首次创建，将会在文档头部自动生成文档配置。
``` md
---
title: 组件
createTime: 2022/03/06 09:41:52
permalink: /post/yiobrmp0
author: pengzhanbo
tags: 
  - react
  - 组件
---
```

- `title` 根据文档名称生成
- `createTime` 根据文件创建时间生成
- `author` 根据 package.json 中的字段生成
- `permalink` 作为文章的永久链接，通过 nanoid 生成唯一链接，可自定义
- `tags` 文章标签，自定义


## 说明

- 由于 vuepress@next 目前尚在 beta开发阶段，随时可能发生变化，本主题可能在未来的版本中无法正常使用。
- 在未来将会持续关注 vuepress@next 开发进度，持续更新维护本主题
- 本主题尚处于开发阶段，目前仅实现了基础的blog功能，未来会继续添加更多的功能
- 欢迎各位尝试使用 vuepress@next 和 本主题
