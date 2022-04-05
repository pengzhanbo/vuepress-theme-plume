---
title: CSS At-Rules
createTime: 2018/10/06 08:16:38
permalink: /article/btkqop1a
author: pengzhanbo
tags: 
  - css
top: false
type: null
---

## @charset

#### 概述
指定样式表中使用的字符编码。 它必须位于样式表中的第一个元素，且前面不得有任何字符。

不能在 `<style>` 元素内的样式属性内使用。

#### 示例：
``` css
@charset "UTF-8";
@charset "utf-8"; /*大小写不敏感*/
/* 设置css的编码格式为Unicode UTF-8 */
@charset 'UTF-8';       /* 无效的, 使用了错误的引号 */
@charset  "UTF-8";      /* 无效的, 多于一个空格 */
 @charset "UTF-8";      /* 无效的, 在at-rule之前多了一个空格 */
@charset UTF-8;         /* Invalid, without ' or ", the charset is not a CSS <string> */
```

## @font-face

#### 概述
指定一个用于显示文本的自定义字体。

字体可以从远程服务器，也可以是用户本地安装的字体。

`@font-face` 可以解除对用户电脑字体的依赖。

#### 语法

``` css
@font-face {
  [ font-family: <family-name>; ] ||
  [ src: <src>; ] ||
  [ unicode-range: <unicode-range>; ] ||
  [ font-variant: <font-variant>; ] ||
  [ font-feature-settings: <font-feature-settings>; ] ||
  [ font-variation-settings: <font-variation-settings>; ] ||
  [ font-stretch: <font-stretch>; ] ||
  [ font-weight: <font-weight>; ] ||
  [ font-style: <font-style>; ] ||
  [ size-adjust: <size-adjust>; ] ||
  [ ascent-override: <ascent-override>; ] ||
  [ descent-override: <descent-override>; ] ||
  [ line-gap-override: <line-gap-override>; ]
}
```
- `font-family`: 指定的 `<family-name>` 将会被用于 `font`或`font-family`的属性
- `src`: 远程字体文件的位置，或者通过`local`函数通过字体名字从本地加载字体。

#### 使用示例：
加载远程字体文件：

``` html
...
  <style>
    @font-face {
      font-family: custom-font;
      src: url("http://example.com/custom-font.ttf")
    }
    body {
      font-family: custom-font;
    }
  </style>
...
```
加载字体文件，先尝试从用户本地加载，如果加载失败则从远程服务器下载:

``` html
...
  <style>
    @font-face {
      font-family: MgOpenModernaBold;
      src: local("Helvetica Neue Bold"),
        url(MgOpenModernaBold.ttf);
    }
    body {
      font-family: MgOpenModernaBold;
    }
  </style>
...
```
加载不同文件格式的字体，根据用户环境判断使用兼容的字体文件格式：
``` html
...
  <style>
    @font-face {
      font-family: custom;
      src: url("custom.ttf") format("tff"),
        url("custom.woff") format("woff"),
        url("custom.woff2") format("woff2");
    }
    body {
      font-family: custom;
    }
  </style>
...
```

## @import

#### 概述
从其他样式表导入样式规则。

`@import` 必须优先于其他类型的规则，即需要在文件顶部声明。`@charset` 除外。

#### 语法
``` css
@import url;
@import url list-of-media-queries;
```
- `url` 样式规则文件资源位置
- `list-of-media-queries` [媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)，支持用逗号分隔多个查询条件。资源仅在满足媒体查询条件时才会被加载。


## @keyframes

#### 概述
通过在动画序列中定义关键帧的样式来控制CSS动画序列中的中间步骤。

#### 示例
使用 `from`,`to` 定义起始和结束关键帧的样式 实现动画
``` css
@keyframes slidein {
  from {
    transform: translateX(0%); 
  }

  to {
    transform: translateX(100%);
  }
}
```
使用 百分比 定义触发关键帧的时间点
``` css
@keyframes slidein {
  0% {
    transform: translateX(0%); 
  }

  50% {
    transform: translateX(50%); 
  }

  100% {
    transform: translateX(100%);
  }
}
```

## @media

媒体查询，详见 [CSS @media 媒体查询](/post/fe5ruia1/)