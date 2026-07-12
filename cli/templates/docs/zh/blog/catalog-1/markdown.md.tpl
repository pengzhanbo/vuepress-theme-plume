---
title: Markdown
tags:
  - markdown
---
## h2 标题

### h3 标题

#### h4 标题

##### h5 标题

###### h6 标题

## 水平分割线

___

---

***

## 排版替换

启用排版选项可查看效果。

(c) (C) (r) (R) (tm) (TM) +-

测试.. 测试... 测试..... 测试?..... 测试!....

!!!!!! ???? ,,  -- ---

“智能引号，双引号” 和 ‘单引号’

## 强调

**这是粗体文本**

**这是粗体文本**

*这是斜体文本*

_这是斜体文本_

~~删除线~~

## 块引用

> 块引用可以嵌套...
>> ...通过将多个大于号紧挨在一起...
> > > ...或在大括号之间加空格。

## 列表

无序

- 通过以 `+`、`-` 或 `*` 开头创建列表
- 子列表通过缩进 2 个空格实现：
  - 标记字符变化会强制开始新列表：
    - Ac tristique libero volutpat at
    - Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
- 非常简单！

有序

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

4. 你可以使用连续的数字...
5. ...或者将所有数字保持为 `1.`

从偏移量开始编号：

1. foo
1. bar

## 代码

内联 `code`

缩进代码

    // 一些注释
    代码第 1 行
    代码第 2 行
    代码第 3 行

块代码“围栏”

```
此处是示例文本...
```

语法高亮

``` js
let foo = function (bar) {
  return bar++
}

console.log(foo(5))
```

## 表格

| 选项   | 描述                                        |
| ------ | ------------------------------------------- |
| data   | 数据文件路径，用于提供将传递给模板的数据。  |
| engine | 用于处理模板的引擎。Handlebars 是默认引擎。 |
| ext    | 目标文件使用的扩展名。                      |

右对齐列

|   选项 |                                        描述 |
| -----: | ------------------------------------------: |
|   data |  数据文件路径，用于提供将传递给模板的数据。 |
| engine | 用于处理模板的引擎。Handlebars 是默认引擎。 |
|    ext |                      目标文件使用的扩展名。 |

## 链接

[链接文本](http://dev.nodeca.com)

[带标题的链接](http://nodeca.github.io/pica/demo/ "标题文本！")

自动转换链接 https://github.com/nodeca/pica（启用 linkify 查看）

## 图片

![小黄人](https://octodex.github.com/images/minion.png)
![暴风兵猫](https://octodex.github.com/images/stormtroopocat.jpg "暴风兵猫")

像链接一样，图片也有脚注风格的语法

![替代文本][id]

稍后在文档中定义 URL 位置的引用：

[id]: https://octodex.github.com/images/dojocat.jpg  "Dojocat"

## 插件

`markdown-it` 的杀手级功能是对 [语法插件](https://www.npmjs.org/browse/keyword/markdown-it-plugin) 的出色支持。

### [表情符号](https://github.com/markdown-it/markdown-it-emoji)

> 经典标记：:wink: :cry: :laughing: :yum:
>
> 快捷方式（表情符号）：:-) :-( 8-) ;)

查看如何使用 twemoji [更改输出](https://github.com/markdown-it/markdown-it-emoji#change-output)。

### [下标](https://github.com/markdown-it/markdown-it-sub) / [上标](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O

### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++插入文本++

### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==标记文本==

### [脚注](https://github.com/markdown-it/markdown-it-footnote)

脚注 1 链接[^first]。

脚注 2 链接[^second]。

内联脚注^[内联脚注文本]定义。

重复的脚注引用[^second]。

[^first]: 脚注**可以包含标记**

    和多个段落。

[^second]: 脚注文本。

### [定义列表](https://github.com/markdown-it/markdown-it-deflist)

术语 1

:   定义 1
带有惰性延续。

术语 2 带有 *内联标记*

:   定义 2

        { 一些代码，定义 2 的一部分 }

    定义 2 的第三段。

_紧凑样式：_

术语 1
  ~ 定义 1

术语 2
  ~ 定义 2a
  ~ 定义 2b

### [缩写](https://github.com/markdown-it/markdown-it-abbr)

这是 HTML 缩写示例。

它会转换“HTML”，但保持像“xxxHTMLyyy”这样的部分条目不变。

*[HTML]: 超文本标记语言

### [自定义容器](https://github.com/markdown-it/markdown-it-container)

::: warning
*此处有龙*
:::
