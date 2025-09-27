---
title: 导入代码
icon: mdi:import
createTime: 2024/04/04 10:39:22
permalink: /guide/code/import/
---

## 概述

导入代码 可以让你在 md 文件中 导入另一个文件的 代码，并为其高亮显示。

它可以帮助你在文章中引用其他文件的代码，避免编写重复的代码。

## 语法

你可以使用下面的语法，从文件中导入代码块：

**输入：**

```md
@[code](../snippet/snippet-1.js)
```

**输出：**

@[code](../../snippet/snippet-1.js)

如果你只想导入这个文件的一部分：

```md
<!-- 仅导入第 1 行至第 10 行 -->
@[code{1-10}](../snippet/snippet-1.js)
```

代码语言会根据文件扩展名进行推断，但我们建议你显式指定：

```md
<!-- 指定代码语言 -->
@[code js](../snippet/snippet-1.js)

<!-- 行高亮 -->
@[code js{2,4-5}](../foo.js)
```
