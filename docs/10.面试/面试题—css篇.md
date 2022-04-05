---
title: 面试题以及个人答案 CSS篇
tags: 
  - 面试
createTime: 2018/08/22 11:15:27
permalink: /article/565o1wn0
author: pengzhanbo
top: false
type: null
---


### CSS：什么是盒模型？盒模型有哪些？具体的表现和不同点是什么？

盒模型是CSS规范定义的模块，它规定了一个矩形盒子（标准盒模型），描述任意元素在文档树中占据的空间区域。每个盒子有四个边：`外边距边（margin edge or outer edge）`、`边框边（border edge）`、`内填充边（padding edge）`和`内容边（content edge or inner edge）`，可以划分四个区域`外边距区域（margin area）`、`边框区域（border area）`、`内填充区域（padding area）`和`内容区域（content area）`。

![css box model](https://drafts.csswg.org/css-box-3/images/box.png)

为什么会有盒模型类型，严格来说，多数浏览器都按照规范实现了标准盒模型，而盒模型的类型主要是来自于不同浏览器对元素宽高的方式不同而导致，IE浏览器认为元素的`width/height`应该是由元素的`内容+内填充+边框`组成，而W3C规定的元素的`width/height`应该是元素的`内容`，从而衍生了不同的盒子模型。到`CSS3`，添加了`box-sizing`属性，用于更改用于计算元素宽高的默认盒子模型，并将IE浏览器和W3C规范纳入了实现中。可以使用此属性来模拟不正确支持CSS盒子模型规范的浏览器的行为。

_注：`width/height`最终并不能完全决定元素的实际占用宽高。_
``` css
/* 关键字值 */
box-sizing: border-box; /* 默认值 */
box-sizing: content-box;
/* 全局值 */
box-sizing: inherit;
box-sizing: initial;
box-sizing: unset;
```
`border-box`规定了元素的`width`由`内容+内填充+边框`组成，即IE浏览器的实现。 元素的实际占据宽度由 width属性+外边距。内容宽度为`width - padding - border`。

`content-box`规定了元素的`width`即`内容宽度`, W3C规范的标准。元素的实际占据宽度由`widht + padding + border + margin`。内容宽度为`width`。

`box-sizing`还有一个待废除的值`padding-box`，`width` 和 `height` 属性包括内容和内边距，但是不包括边框和外边距。只有Firefox实现了这个值，它在Firefox 50中被删除。

在高度计算上以上规则同样适用，但对非替换行内元素，尽管内容周围存在内边距与边框，但其占用空间受到`line-height`属性影响。

____

### CSS: 什么是外边距合并？什么情况下会发生外边距合并？

块元素的上外边距和下外边距有时候会发生合并，其大小取其中绝对值最大的值，这种行为叫做外边距合并。

__浮动元素__ 和 __绝对定位元素__ 的外边距不会发生合并。这是因为触发了 __块格式化上下文__ 。

1. 相邻元素之间的外边距会发生合并（如果后一个元素需要清除前面的浮动，则不一定发生合并）。
2. 父元素与其第一个子元素之间不存在边框、内边距、行内内容、没有创建 __块格式化上下文__、没有清除浮动；或者父元素与其最后一个子元素之间不存在边框、内边距、行内内容、heigh、min-height、max-height，那么子元素的外边距会溢出到父元素外面。
3. 如果一个块级元素不包含任何内容，并且在不存在边框、内边距、行内内容、heigh、min-height，则该元素的上下外边距会发生合并。

三种情况的外边距合并是可以组合产生更加复杂的外边距合并情况的。

_如果外边距合并的值都是负值，则合并的值为最小的外边距的值。_

_如果发生外边距合并的值包含负值，则合并后的值为最大的正外边距与最小的负外边距之和。_

_____

### CSS：垂直水平居中

_这是个老生常谈的问题了，场景可以有很多，答案也有很多，答案而言其实本身不重要，重要是明白为什么这个方法为什么可以实现垂直居中。_

__设立一个场景：在一个宽高不固定的容器中，实现一个宽高不固定的内容盒子，并垂直水平居中。__
``` html
<!-- 假设 warpper、container 宽高不固定 实现container相对于wrapper垂直水平居中-->
<div class="wrapper">
    <div class="container">
    </div>
</div>
```
__方法一：__ 使用 flex 布局
``` css
.wrapper{
    display: flex;
}
.container{
    margin: auto;
}
```
适用于支持 flex布局的浏览器（IE11以上，其他现代浏览器）。这里是利用flex弹性布局的特性，弹性容器改变了其子元素填充可用空间的方式，子元素默认从容器左上角开始排列，在不设置宽高时，子元素填充空间由`flex`声明，默认值为`0 1 auto`,即
`flex-grow: 0;flex-shrink: 1;flex-basis: auto`; 其中 `flex-basis`定义了子元素的宽和高的尺寸大小，`auto`值表示自动尺寸，根据子元素内容计算宽高，在子元素上设置`margin: auto`，这是利用`auto`平均分配水平或垂直方向上的额外的空间，从而达到目的。（此方法实现的结果是“真正的”垂直水平居中）

或者
``` css
.wrapper{
    display: flex;
    justify-content: center;
    align-content: center;
}
```

__方法二：__ 使用 table 布局
``` css
.wrapper{
    display: table-cell;
    vertical-align: middle;
}
.container{
    margin: auto;
}
```
利用的是table布局的特性，不过该方法有个缺点就是，`display: table-cell`元素的宽高设置百分比数值是“无效的”，原因是父元素非`table`元素或`display: table`元素，`display: table-cell`元素的宽高百分比数字是相对于`table`计算的。

__方法三：__ `position` + `transform`
``` css
.wrapper{
    position: relative;
}
.container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```
该方法与前面两个方法的作用机理有很大的不同，首先第一点是`container`脱离了文档流，并且`container`自身的宽高发生了坍塌，在不设置宽高属性下，尺寸由内容撑开，`container`相对`wrapper`元素进行绝对定位，水平方向与垂直方向上，`container`的左上角顶点偏移到`wrapper`中点，`container`的`transform`是相对于自身的，` translate(-50%, -50%)`相对于自身，将左上角顶点做左上偏移自身的一半，从而实现了目的。

_有一些面试者给出了`container`元素上设置`margin-left: -50%; margin-top: -50%`的答案，然而，margin的百分比值，是相对于其父元素计算的。_

__方法四：__ 使用 行内块元素
``` css
.wrapper{
    text-align: center;
}
.wrapper:after{
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
}
.container{
    display: inline-block;
    vertical-align: middle;
    text-align: left;
}
```
该方法实现的垂直水平居中其实是一个近似垂直水平居中，兼容IE7以上的浏览器。水平方向上`.wrapper`设置`text-align: center;`实现了水平居中；垂直方向上，给定`container`声明行内块元素，并`vertical-align: middle`，但由于`container`高度不确定，无法声明具体的行高，所以借助了父元素的伪类元素，创建了一个宽度为0高度为100%的行内块元素，从而使`container`元素在垂直方向上实现了居中。但由于`vertical-align: middle`是元素的中线与字符X的中心点对齐，大多数字体设计字体的中心点偏下，也导致了实现的垂直居中并不是绝对的垂直居中。而要实现绝对的垂直居中，需要添加一下属性：
```css
.wrapper{
    font-size: 0;
    white-space: nowrap;
}
.container{
    font-size: 14px; /* 重置回默认字体大小 */
    white-space: normal;
}
```
实现方法有很多，这里暂时只列出其中的四种。

____

_想到还有其他问题继续补充..._
