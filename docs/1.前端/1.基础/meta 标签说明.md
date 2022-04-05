---
title: meta 标签说明
createTime: 2018/03/15 01:21:48
permalink: /article/bp1nxjs6
author: pengzhanbo
tags: 
  - html
top: false
type: null
---

<meta> 标签提供关于 HTML 文档的元数据。它不会显示在页面上，但是对于机器是可读的。可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务。

<!-- more -->

## 定义

提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词。

## 用法

标签位于文档的头部，不包含任何内容。<meta> 标签的属性定义了与文档相关联的名称/值对。

## 属性

| 属性 | 是否可选 | 描述 |
| :----: | :----:     | :----  |
| content | 必选  | 定义与 http-equiv 或 name 属性相关的元信息。  |
| http-equiv | 可选 | 把 content 属性关联到 HTTP 头部。 |
| name | 可选 | 把 content 属性关联到一个名称。 |
| charset | 可选 | 定义编码格式 |

## 常用meta标签说明

### charset

charset是声明文档使用的字符编码，主要用于解决编码问题导致的乱码。 charset一定要写在第一行。

两种charset的写法

```html
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
```

## viewport

viewport主要是影响移动端页面布局

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**content 参数：**

1. **width**： viewport 宽度(数值/device-width)
2. **height**： viewport 高度(数值/device-height)
3. **initial-scale**： 初始缩放比例
4. **maximum-scale**： 最大缩放比例
5. **minimum-scale**： 最小缩放比例
6. **user-scalable**： 是否允许用户缩放(yes/no)

### SEO优化相关

```html
<!-- 页面标题<title>标签(head 头部必须) -->
<title>your title</title>
<!-- 页面关键词 keywords -->
<meta name="keywords" content="your keywords">
<!-- 页面描述内容 description -->
<meta name="description" content="your description">
<!-- 定义网页作者 author -->
<meta name="author" content="author,email address">
<!-- 定义网页搜索引擎索引方式，robotterms 是一组使用英文逗号「,」分割的值，
通常有如下几种取值：none，noindex，nofollow，all，index和follow。 -->
<meta name="robots" content="index,follow">
```

**robots具体参数如下：**

1. none : 搜索引擎将忽略此网页，等价于noindex，nofollow。
2. noindex : 搜索引擎不索引此网页。
3. nofollow: 搜索引擎不继续通过此网页的链接索引搜索其它的网页。
4. all : 搜索引擎将索引此网页与继续通过此网页的链接索引，等价于index，follow。
5. index : 搜索引擎索引此网页。
6. follow : 搜索引擎继续通过此网页的链接索引搜索其它的网页。

### 移动端常用的meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- 删除苹果默认的工具栏和菜单栏 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<!-- 设置苹果工具栏颜色 -->
<meta name="format-detection" content="telphone=no, email=no" />
<!-- 忽略页面中的数字识别为电话，忽略email识别 -->
 
<!-- 启用360浏览器的极速模式(webkit) -->
<meta name="renderer" content="webkit">
<!-- 避免IE使用兼容模式 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
<meta name="HandheldFriendly" content="true">
<!-- 微软的老式浏览器 -->
<meta name="MobileOptimized" content="320">
<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
<!-- windows phone 点击无高光 -->
<meta name="msapplication-tap-highlight" content="no">
```

### 百度禁止转码

百度会自动对网页进行转码，这个标签是禁止百度的自动转码

```html
<meta http-equiv="Cache-Control" content="no-siteapp" />
```

### Microsoft Internet Explorer

```html
<!-- 优先使用最新的ie版本 -->
<meta http-equiv="x-ua-compatible" content="ie=edge">
<!-- 是否开启cleartype显示效果 -->
<meta http-equiv="cleartype" content="on">
<meta name="skype_toolbar" content="skype_toolbar_parser_compatible">
 
<!-- Pinned Site -->
<!-- IE 10 / Windows 8 -->
<meta name="msapplication-TileImage" content="pinned-tile-144.png">
<meta name="msapplication-TileColor" content="#009900">
<!-- IE 11 / Windows 9.1 -->
<meta name="msapplication-config" content="ieconfig.xml">
```

### Google Chrome

```html
<!-- 优先使用最新的chrome版本 -->
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<!-- 禁止自动翻译 -->
<meta name="google" value="notranslate">
```

### 360浏览器

```html
<!-- 选择使用的浏览器解析内核 -->
<meta name="renderer" content="webkit|ie-comp|ie-stand">
```

### UC手机浏览器

```html
<!-- 将屏幕锁定在特定的方向 -->
<meta name="screen-orientation" content="landscape/portrait">
<!-- 全屏显示页面 -->
<meta name="full-screen" content="yes">
<!-- 强制图片显示，即使是"text mode" -->
<meta name="imagemode" content="force">
<!-- 应用模式，默认将全屏，禁止长按菜单，禁止手势，标准排版，强制图片显示。 -->
<meta name="browsermode" content="application">
<!-- 禁止夜间模式显示 -->
<meta name="nightmode" content="disable">
<!-- 使用适屏模式显示 -->
<meta name="layoutmode" content="fitscreen">
<!-- 当页面有太多文字时禁止缩放 -->
<meta name="wap-font-scale" content="no">
```

### QQ手机浏览器

```html
<!-- 锁定屏幕在特定方向 -->
<meta name="x5-orientation" content="landscape/portrait">
<!-- 全屏显示 -->
<meta name="x5-fullscreen" content="true">
<!-- 页面将以应用模式显示 -->
<meta name="x5-page-mode" content="app">
```

### Apple iOS

```html
<!-- Smart App Banner -->
<meta name="apple-itunes-app" 
content="app-id=APP_ID,affiliate-data=AFFILIATE_ID,app-argument=SOME_TEXT">
 
<!-- 禁止自动探测并格式化手机号码 -->
<meta name="format-detection" content="telephone=no">
 
<!-- Add to Home Screen添加到主屏 -->
<!-- 是否启用 WebApp 全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- 设置状态栏的背景颜色,只有在 “apple-mobile-web-app-capable” content=”yes” 时生效 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<!-- 添加到主屏后的标题 -->
<meta name="apple-mobile-web-app-title" content="App Title">
```

### Google Android

```html
<meta name="theme-color" content="#E64545">
<!-- 添加到主屏 -->
<meta name="mobile-web-app-capable" content="yes">
```