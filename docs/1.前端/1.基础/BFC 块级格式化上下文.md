---
title: BFC 块级格式化上下文
createTime: 2018/05/17 12:28:33
permalink: /article/o5g7ggvf
author: pengzhanbo
top: false
tags: 
  - html
type: null
---
## 概念

BFC, Block Formating Context。是 W3C CSS2.1规范中的一个概念。 是页面中的一块块级渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和作用。

具有BFC特性的元素，可以看做是一个被隔离了的独立容器，容器内的元素不会在布局上影响到外面的元素，并且BFC具有普通容器所没有的一些特性。

## 创建BFC的方式

1. 根元素（html）
2. 浮动元素，即 float值不为 none。
3. 绝对定位元素， 元素的 position  为 absolute 或者 fixed
4. 行内块元素， 元素的 display 为 inline-block
5. 表格单元格， 元素的 display 为 table-cell。 （HTML表格单元格默认为该值）
6. 表格标题， 元素的display为table-caption。 （HTML表格标题默认为该值）
7. 匿名表格单元格元素， 元素的display为 table、table-row、table-row-group、table-header-group、table-footer-group 。 （分别是 HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table。
8. overflow计算值不为visible的块元素
9. display值为 flow-root的元素
10. contain值为 layout、content、paint的元素
11. 弹性元素，display为 flex、inline-flex元素的直接子元素
12. 网格元素， display为gird、inline-gird元素的直接子元素
13. 多列容器，元素的column-count或column-width不为 auto， 包括column-count不为1
14. colum-span为all的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中。

## 作用

1. 同一个BFC的外边距会发生折叠（合并）， 通过将其放在不同的BFC中规避折叠。
2. BFC可以包含浮动元素，即清除浮动。
3. BFC可以阻止元素被浮动元素覆盖。