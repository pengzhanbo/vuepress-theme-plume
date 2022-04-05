---
title: 1px解决方案
createTime: 2019/05/15 10:41:32
permalink: /article/tz7ncicn
author: pengzhanbo
tags: 
  - html
  - css
  - develop
top: false
type: null
---

在日常移动端前端应用开发中，经常遇到一个问题就是 1px的线在移动端 Retina屏下的渲染并未达到预期。以下总几种不同场景下的 1px解决方案。

<!-- more -->

## 背景及原因

首先，需要明确的一个概念是， CSS的 `pixels` 并不完全等价于 设备的 `pixels`。当我们假定设备的 `pixels` 为标准的`pixels` 宽度。这些pixels决定了设备的分辨率。在默认情况下， PC设备上用户未进行缩放操作（即zoom缩放为100%时）, CSS的`pixels`与设备的`pixels`重叠，当用户进行了缩放操作时，假设用户缩放了200%，那么 124px的CSS`pixels`实际占用了248设备`pixels`。

但我们开发时，通常设备的`pixels`对我们毫无用处，前端只需要关注CSS的`pixels`，浏览器会根据用户缩放自动处理CSS的pixels是被伸展还是收缩。

但在移动端设备中，由于设备的宽度较小，导致了可显示的内容要少得多。浏览器或者缩放变小，导致内容无法阅读，或者通过拖动来浏览未被显示的内容。这导致了原本适合于PC设备的CSS布局，放到了移动端，变得十分丑陋。

为了解决这个问题，移动端设备的厂商的通常做法是，让viewport更宽（这里的viewport指的是设备的视窗，它决定了HTML标签的宽度表现，继而影响其他的元素）。

移动端的 viewport 被分为了 虚拟的 viewport 和 布局的 viewport：
- `visual viewport`： 虚拟viewport
- `layout viewport`： 布局viewport

![](/images/viewport.jpg)

两者的概念， 可以想象 `layout viewport` 为一张不可改变大小和角度的图片，但它被一层蒙板挡住了， `visual viewport` 是一个蒙板上我们可以观察到 这张图片的窗口。我们可以通过这个窗口观察到 图片的部分内容。并且可以对这个窗口进行拖动或缩放，进而观察到图片的完整内容。

在这里，`visual viewport` 相当于 移动端设备的屏幕，用户的 缩放和拖动操作，反馈到 `layout viewport` ,则是相对的变成 `layout viewport` 被 拖动和缩放。

而通常我们关注的 CSS`pixels`，通常是按照 `layout viewport`来定义的，所以会比`visual viewport` 宽很多。而 `<html>`元素的宽度继承于`layout viewport`。这可以保证你的网站的UI可以在移动端设备和桌面设备表现一致。

但是 `layout viewport`的宽度有多宽，不同的设备，不同的浏览器各有不同。如 iPhone 的Safari 使用的是 980px。


但是在移动端的交互中，我们并不期望 网站的内容是被缩放的，需要让用户进行缩放和拖动。 所以通常我们会在 html文件的head中，进行一个 meta声明。
``` html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
```
即强制设置了`layout viewport` 等于 设备宽度， 设置了缩放为100%，并且用户无法进行缩放操作。这样做的好处是我们可以以一种期望的方式进行设计UI和交互。

但在前面，我们介绍了， CSS的`pixels`并不等价于设备的`pixels`。通常在移动端设备，我们可以通过 `window.devicePixelRatio` 查看当前设备的CSS`pixels`和设备`pixels`的比例，如 `window.devicePixelRatio` 值为 2时， 表示 1个CSS`pixels`的宽度占用2个设备`pixels`，即实际占用了 2x2 的设备`pixels`。

这也是导致了 `1px`的线，在移动设备上的渲染，看起来会比实际上的 `1px`更粗的原因。

知道了问题的背景，和产生的原因，那么只需要让 `1px`的 CSS`pixels`的表现，接近于或者贴合 `1px`的设备`pixels`, 那么就可以解决这个问题了。

## 解决方案

如何让 `1px`的 CSS`pixels`的表现，接近于或者贴合 `1px`的设备`pixels`。这个问题需要具体场景具体分析。

### border-width: 0.5px

一种最简单的，且适合各种场景的方案，就是使用 `0.5px` 的值代替 `1px` 的值。 但这个方案有一个兼容问题，现代浏览器并不全都支持该值的。

可以先检查是否支持 `0.5px`，然后在 根元素上添加一个 类，进行使用。
``` js
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  var testElem = document.createElement('div');
  testElem.style.border = '.5px solid transparent';
  document.body.appendChild(testElem);
  if (testElem.offsetHeight == 1)
  {
    document.querySelector('html').classList.add('hairlines');
  }
  document.body.removeChild(testElem);
}
```
``` css
div {
  border: 1px solid #bbb;
}

.hairlines div {
  border-width: 0.5px;
}
```

这种方案的好处是简单，能够适配所有场景，但是从兼容性上看，iOS7及之前的版本、Android设备等，均不支持`0.5px`的渲染。

### 伪类 + transform缩放

该方法是是利用 元素的伪类进行线的渲染。

比如 利用 `::before` 或者 `::after`, 画一条上边框的线
``` css
.hairlines {
    position: relative;
}
.hairlines::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 1px;
    background-color: #000;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
```
比如，利用 `::before` 或者 `::after`, 画一个线框：
``` css
.hairlines {
    position: relative;
}
.hairlines::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    display: block;
    width: 200%;
    height: 200%;
    border: 1px solid #000;
    transform: scale(0.5);
    transform-origin: 0 0;
}
```

该方案的好处同样能都适配多数场景，并且支持圆角的情况。
但缺点在于由于对元素本身设置了`position`，以及使用了伪类，但另一个交互需要使用到被占用的属性时，需要分情况处理问题。

### border-image 图片

使用 border-image-slice 对边框图片进行偏移。

该方案的方法，比如处理 x轴方向的线时， 需要准备 一张2px高的图片，根据显示是上边框，还是下边框，如上边框，则该图片的 上一半1px为对应的颜色的先，下一半为透明。

_line.png_ ![1px-lines.png](/images/1px-lines.png)

``` css
div {
    border-top: 1px transparent;
    border-image: url(line.png) 2 0 0 0 repeat;
}
```
同理，处理其他方向的边框类似方法。

该方法的缺点是 如果改变颜色，或者有不同颜色的线，需要准备多张图片。

优先是适合多数的场景，且不对元素本身做出影响文档流的改动。

### SVG

由于CSS也支持 SVG 作为 image 资源使用，且SVG是矢量图片，能够相比于使用jpg、png格式的图片获得更好的保真。
可以配合 CSS 的 `background-image` 或者 `border-image` 满足不同场景的需要。

建议此方案配合 CSS 预渲染，如`stylus/sass/less` 进行使用， 也可使用`postcss` 相关插件使用。

如在 stylus中：

``` stylus
// 画一个元素的线框
borderXY(color = #eee, radius = 8px) {
    $r = unit(radius/ 2, '');
    border-radius radius /*px*/
    background-image url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 200% 200%' preserveAspectRatio='xMidYMid meet'><rect fill='rgba(0,0,0,0)' width='100%' height='100%' stroke-width='1' stroke='%s' rx='%s' ry='%s'/></svg>", color, $r, $r))
    background-repeat no-repeat
    background-position 0 0
    background-size 100% 100%
}

// 画一个元素的 上下边框
borderX(color = #eee) {
    border 0
    border-top: 1px solid color; /*no*/ 
    border-bottom: 1px solid color; /*no*/
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='200' width='100'><line x1='0' y1='25' x2='100' y2='25' stroke='%s' style='stroke-width:50'/><line x1='0' y1='75' x2='100' y2='75' style='stroke:transparent;stroke-width:50'/><line x1='0' y1='125' x2='100' y2='125' style='stroke:transparent;stroke-width:50'/><line x1='0' y1='175' x2='100' y2='175' stroke='%s' style='stroke-width:50'/></svg>", color, color)) 100 0 100 0 stretch;
}

// 画一个元素的 左右边框
borderY(color = #eee) {
    border 0 
    border-left: 1px solid color; /*no*/ 
    border-right: 1px solid color; /*no*/ 
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='200'><line x1='25' y1='0' x2='25' y2='100' stroke='%s' style='stroke-width:50'/><line x1='75' y1='0' x2='75' y2='100' style='stroke:transparent;stroke-width:50'/><line x1='125' y1='0' x2='125' y2='100' style='stroke:transparent;stroke-width:50'/><line x1='175' y1='0' x2='175' y2='100' stroke='%s' style='stroke-width:50'/></svg>", color, color)) 0 100 0 100 stretch;
}

// 画一个元素的上边框
borderTop(color = #eee) {
    border 0 
    border-top: 1px solid color; /*no*/ 
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='100'><line x1='0' y1='25' x2='100' y2='25' stroke='%s' style='stroke-width:50'/><line x1='0' y1='75' x2='100' y2='75' style='stroke:transparent;stroke-width:50'/></svg>", color)) 100 0 0 0 stretch;
}

// 画一个元素的下边框
borderBottom(color = #eee) {
    border 0
    border-bottom: 1px solid color; /*no*/ // 设置border 0后，如果color设置为transparent，则该边框会变成透明
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='100'><line x1='0' y1='25' x2='100' y2='25' style='stroke:transparent;stroke-width:50'/><line x1='0' y1='75' x2='100' y2='75' stroke='%s' style='stroke-width:50'/></svg>", color)) 0 0 100 0 stretch;
}

// 画一个元素的左边框
borderLeft(color = #eee) {
    border 0
    border-left: 1px solid color; /*no*/
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='100'><line x1='25' y1='0' x2='25' y2='100' stroke='%s' style='stroke-width:50'/><line x1='75' y1='0' x2='75' y2='100' style='stroke:transparent;stroke-width:50'/></svg>", color)) 0 0 0 100 stretch;
}
// 画一个元素的右边框
borderRight(color = #eee) {
    border 0 
    border-right: 1px solid color; /*no*/ 
    border-image: url(s("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' height='100' width='100'><line x1='25' y1='0' x2='25' y2='100' style='stroke:transparent;stroke-width:50'/><line x1='75' y1='0' x2='75' y2='100' stroke='%s' style='stroke-width:50'/></svg>", color)) 0 100 0 0 stretch;
}

div {
    borderXY()
}
```
如果是使用 `postcss` ，可以使用安装插件 [postcss-write-svg](https://github.com/csstools/postcss-write-svg)，配合使用
``` css
@svg square {
	@rect {
		fill: var(--color, black);
		width: var(--size);
		height: var(--size);
	}
}

.example {
	background: svg(square param(--color green) param(--size 100%)) center / cover;
}
```

使用SVG的优点是，支持调整线的颜色，支持设置圆角，可以根据场景不同，选择 `background-image` 或者 `border-image` 满足绝大多数的场景。

### background-image + jpg/png 图片

该做法是使用一张该元素的多倍的背景图，进行线的渲染。

该做法一般不推荐。

### 背景渐变

该方案不推荐

### box-shadow

该方案不推荐
