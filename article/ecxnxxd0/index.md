---
url: /article/ecxnxxd0/index.md
---
::: info 说明
本文 翻译 [Introduction to YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) 的部分内容。
用于简单说明如何在 markdown 文件中使用 frontmatter。

如果您具有良好的英语阅读基础，为避免翻译可能存在的内容失真，建议您阅读原文。

原文地址： <https://dev.to/paulasantamaria/introduction-to-yaml-125f> 。
:::

## 介绍

YAML 是一种数据序列化语言，通常用于配置文件，例如
[Open API 规范](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/api-with-examples.yaml) 或 [CI/CD 管道](https://docs.gitlab.com/ee/ci/yaml/)。

::: note 有趣的事实！🤓
根据 [YAML 1.0 规范文档 （2001-05-26）](https://yaml.org/spec/history/2001-05-26.html) 首字母缩略词
“YAML” 代表 “Yet Another Markup Language”，
但后来在 [2002-04-07 规范](https://yaml.org/spec/history/2002-04-07.html) 中更改为递归首字母缩略词“YAML Ain't Markup Language”。
:::

正如最新规范中所述，**YAML** 旨在 **对处理数据的人友好**，并通过 **最大限度地减少结构字符的使用来实现“独特的干净度”**，
允许数据以自然和有意义的方式显示。

最新规范还指出，YAML *1.2 作为官方子集符合 JSON* ，这意味着大多数 JSON 文档都可以解析为 YAML。

YAML 通过使用基于缩进的范围界定（类似于 Python）轻松检查数据结构。

::: note 另一个有趣的事实！🤓
DEV.to 文章使用 YAML 来定义自定义变量，如标题、描述、标签等。
:::

## 基本语法

YAML 文档基本上是 **键值对的集合**，其中值可以像字符串一样简单，也可以像树一样复杂。

以下是有关 YAML 语法的一些说明：

* **缩进用于表示结构**。不允许使用制表符，只要子节点的缩进量比父节点大，空格的数量就无关紧要。
* 允许使用 UTF-8、UTF-16 和 UTF-32 编码。

### 字符串

```md
---
# 字符串不需要引号：
title: Introduction to YAML

# 但你仍可使用它们：
title-w-quotes: 'Introduction to YAML'

# 多行字符串以 | 开头
execute: |
  npm ci
  npm build
  npm test
---
```

上面的代码将转换为 JSON 为：

```json
{
  "title": "Introduction to YAML",
  "title-w-quotes": "Introduction to YAML",
  "execute": "npm ci\nnpm build\nnpm test\n"
}
```

### 数字

```md
---
# 整数：
age: 29

# 浮点数：
price: 15.99

# 科学计数法：
population: 2.89e+6
---
```

上面的代码将转换为 JSON 为：

```json
{
  "age": 29,
  "price": 15.99,
  "population": 2890000
}
```

### 布尔值

```md
---
# 布尔值可以有不同的表示方式：
published: false
published: False
published: FALSE
---
```

以上所有内容都将转换为 JSON，如下所示：

```json
{
  "published": false
}
```

### Null 值

```md
---
# Null 值可以通过不设置值来表示：
null-value:

# 或者更明确地说：
null-value: null
null-value: NULL
null-value: Null
---
```

以上所有内容都将转换为 JSON，如下所示：

```json
{
  "null-value": null
}
```

### 日期和时间戳

可以使用 ISO 格式的日期，如下所示：

```md
---
date: 2002-12-14
canonical: 2001-12-15T02:59:43.1Z
iso8601: 2001-12-14t21:59:43.10-05:00
spaced: 2001-12-14 21:59:43.10 -5
---
```

### Sequences 序列

序列允许我们在 YAML 中定义列表：

```md
---
# 使用连字符的数字列表：
numbers:
  - one
  - two
  - three

# 内联版本：
numbers: [ one, two, three ]
---
```

上述两个序列都将解析为 JSON，如下所示：

```json
{
  "numbers": [
    "one",
    "two",
    "three"
  ]
}
```

### 嵌套值

我们可以使用上述所有类型来创建具有嵌套值的对象，如下所示：

```md
---
# 一九八四小说数据。
nineteen-eighty-four:
  author: George Orwell
  published-at: 1949-06-08
  page-count: 328
  description: |
    A Novel, often published as 1984, is a dystopian novel by English novelist George Orwell.
    It was published in June 1949 by Secker & Warburg as Orwell's ninth and final book.
---
```

这将转换为 JSON ：

```json
{
  "nineteen-eighty-four": {
    "author": "George Orwell",
    "published-at": "1949-06-08T00:00:00.000Z",
    "page-count": 328,
    "description": "A Novel, often published as 1984, is a dystopian novel by English novelist George Orwell.\nIt was published in June 1949 by Secker & Warburg as Orwell's ninth and final book.\n"
  }
}
```

### 对象列表

将序列和嵌套值组合在一起，我们可以创建一个对象列表。

```md
---
# Let's list books:
- nineteen-eighty-four:
    author: George Orwell
    published-at: 1949-06-08
    page-count: 328
    description: |
      A Novel, often published as 1984, is a dystopian novel by English novelist George Orwell.

- the-hobbit:
    author: J. R. R. Tolkien
    published-at: 1937-09-21
    page-count: 310
    description: |
      The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien.
---
```

## 独特特性

以下是一些引起我注意的 **更复杂的功能** ，它们也使 YAML 与 JSON 区分开来。

### 注释

你可能已经在我前面的示例中注意到，YAML 允许以 `#` 开头的注释。

```md
---
# 这是一个非常有用的注释。
---
```

### 锚点的可重用性

节点锚点用于 **标记一个节点** 以供将来引用，从而允许我们重复使用该节点。
要标记一个节点，我们使用 `&` 字符，要引用它，我们使用 `*` ：

在下面的示例中，我们将定义一个书籍列表并重用作者数据，因此我们只需要定义一次：

```md
---
# 作者数据：
author: &gOrwell
    name: George
    last-name: Orwell

# 一些书籍：
books:
    - 1984:
        author: *gOrwell
    - animal-farm:
        author:*gOrwell
---
```

解析为 JSON 后，上面的代码将如下所示：

```json
{
  "author": {
    "name": "George",
    "last-name": "Orwell"
  },
  "books": [
    {
      "1984": {
        "author": {
          "name": "George",
          "last-name": "Orwell"
        }
      }
    },
    {
      "animal-farm": {
        "author": {
          "name": "George",
          "last-name": "Orwell"
        }
      }
    }
  ]
}
```

### 带有标签的显式数据类型

正如我们在之前的示例中所见，YAML 会自动检测我们值的类型，但我们也可以 **指定所需的类型** 。

我们通过在值前加上 `!!` 类型来指定它。

以下是一些示例：

```md
---
# 以下值应为整数，无论何种情况：
should-be-int: !!int 3.2

# 解析任何值为字符串：
should-be-string: !!str 30.25

# 我需要下一个值为布尔类型：
should-be-boolean: !!bool yes
---
```

这将转换为 JSON：

```json
{
  "should-be-int": 3,
  "should-be-string": "30.25",
  "should-be-boolean": true
}
```
