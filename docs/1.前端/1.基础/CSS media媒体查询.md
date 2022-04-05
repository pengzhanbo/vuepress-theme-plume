---
title: CSS 媒体查询
createTime: 2018/08/18 08:43:02
permalink: /article/fe5ruia1
author: pengzhanbo
tags: 
  - css
top: false
type: null
---

开发响应式网站时，常常需要使用到 media 媒体查询。这里总结下媒体查询的使用方法。

## 概述
媒体查询是通过判断当前媒体是否满足 媒体查询规则，从而使其包含的 CSS规则生效。

从 CSS level 2 开始，就已经支持 `media-queries`，到 CSS level 3 以及之后的版本，媒体查询变得更加的丰富和能够适应更多的场景。

## 使用

媒体查询可以通过以下三种方式进行使用：

#### 在 `<link>` 元素引入CSS资源时，声明 `media` 属性

``` html
<link rel="stylesheet" type="text/css" href="media/custom.css" media="screen and (min-width: 400px)">
```

#### 在`<style>` 上 声明 `media` 属性
``` html
<style media="screen and (min-width: 400px)">
</style>
```

#### 在`@import` 后 声明 媒体查询条件
``` css
@import url('custom.css') screen and (min-width: 400px);
```

#### 在样式表中使用 At-Rule `@media` 使用媒体查询规则
``` css
@media screen and (min-width: 400px) {
  .example {
    color: red;
  }
}
```

### 语法

``` html
<link rel="stylesheet" type="text/css" href="media/custom.css" media="[media-queries-list]">

<style media="[media-queries-list]">
</style>

<style>
  @import url [media-queries-list];

  @media [media-queries-list] {
    <style-sheet-group>
}
</style>
```

## 媒体查询 [media-queries-list]

`media-queries-list` 可以由以下三种内容组成：

- `Media types` ：媒体类型, 表示设备
- `Media features` ：媒体特性, 表示设备的状态
- `Logical operators` ： 逻辑操作符, 连接多个 `media-query`

### Media types

`Media types` 描述设备的一般类型。可以使用以下值：

- `all`: 表示适用于所有设备。 默认值。
- `print`: 表示 适用于在屏幕上以打印预览的模式查看页面和文档。
- `screen`: 表示 适用于屏幕 。

> 在 *css2.1* 和 *Media Queries 3* 中还支持 `tty`，`tv`，`projection`，`handheld`，`braille`，`embossed`，`aural`，但这些值都已经在*Media Queries 4* 中被弃用。

### Media features

媒体特性，描述 用户代理、输出设备以及环境的特定特征。

媒体特性表达式是完全是可选的，并且负责测试这些特性是否存在，值为多少。 且每个媒体特性表达式都必须使用括号括起来。

*以下仅列出比较常用到的媒体特性*

- `width`: 视窗（viewport）的宽度，包括纵向滚动条的宽度。
  
  值的类型为 number，单位可以是 `px`、`em` 等。
  ``` css
  with: 400px
  ```

- `height`: 视窗（viewport）的高度。
  
  值的类型为 number，单位可以是 `px`、`em` 等。
  ``` css
  height: 600px
  ```

- `aspect-ratio`： 视窗（viewport）的宽高比。
  
  值的类型为 number/number。
  ``` css
  aspect-ratio: 3/2
  ```

- `orientation`： 视窗（viewport） 的旋转方向。
  - portrait： 设备竖屏
  - landscape： 设备横屏
  ``` css
  orientation: landscape
  ```
- `resolution`: 输出设备的分辨率
  
  值的类型为 number，单位为 `dpi`。
  ``` css
  resolution: 320dpi
  ```

- `scan`：输出设备的扫描过程（适用于电视机等）。

#### 媒体特性前缀

大部分的媒体特性均支持前缀，用于约束媒体特性的作用范围。

- `max-[media feature]`： 小于指定的最大值时，返回*true*
- `min-[media feature]`: 大于指定的最小值时，返回*true*
  
*个人认为使用前缀时其表述稍显拗口，建议使用取值范围的方式声明表达式*

#### 媒体特性语法

- 以键值对的形式，表述取固定的值
  ````
  ([media-feature-name]: [media-feature-value])
  ````

- 直接书写name， 表示值的结果为 boolean
  ```
  ([media-feature-name])
  ```

- 表述 特性的取值范围
  
  *声明 range 为描述数学符号 :  '<' | '>' | '<=' | '>='*
  
  ```
  ([media-feature-name] [range] [media-feature-value])
  ([media-feature-name] [range] [media-feature-value] [range] [media-feature-value])
  ```


### Logical operators

逻辑操作符用于组成复合的 media queries。

- `and`: 用于合并多条`media query`, 且 每条 `media query` 均返回 *true* 时， 
  媒体查询表达式的结果返回*true*。
- `not`: 取反操作，使用`not [media query]`，当`media query` 返回 *false* 时， 
  媒体查询表达式的结果返回*true*。
- `,`: or操作符，组合多个 `media query`，任意一个`media query` 返回 *true*,
  媒体查询表达式的结果返回*true*。
- `only`: 不支持更加高级的媒体类型的浏览器检测到only修饰的时候就会抛弃这个规则



## 使用示例详解

### 示例1：
``` css
@media screen and (width > 414px) {}
```
当设备的屏幕视窗宽度大于414px时，应用CSS块中的样式规则。

### 示例2：
``` css
@media (width > 800px), screen and (orientation: landscape) {}
```
当前设备 视窗宽度大于 800px， 或者设备方向为横向时，应用css块中的样式规则。

### 示例3：
``` css
@media screen and (414px < width  < 800px) {}
```
当前设备屏幕视窗宽度 大于 414px 且 小于 800px 时， 应用css块中的样式规则。

