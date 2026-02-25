---
url: /en/article/ecxnxxd0/index.md
---
::: info Note
This article translates parts of [Introduction to YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f).
It provides a basic explanation of how to use frontmatter in markdown files.

If you have a good foundation in English reading, to avoid potential content distortion from translation,
it is recommended that you read the original article.

Original article: <https://dev.to/paulasantamaria/introduction-to-yaml-125f>.
:::

## Introduction

YAML is a data serialization language, commonly used for configuration files, such as the
[Open API Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/api-with-examples.yaml) or [CI/CD pipelines](https://docs.gitlab.com/ee/ci/yaml/).

::: note Fun Fact! 🤓
According to the [YAML 1.0 Specification Document (2001-05-26)](https://yaml.org/spec/history/2001-05-26.html),
the acronym "YAML" stood for "Yet Another Markup Language".However,
it was later changed to the recursive acronym "YAML Ain't Markup Language" in the [2002-04-07 specification](https://yaml.org/spec/history/2002-04-07.html).
:::

As stated in the latest specification, **YAML** is designed to be **human-friendly for handling data**
and achieves "unique cleanliness" by **minimizing the use of structural characters**,
allowing data to be displayed in a natural and meaningful way.

The latest specification also states that YAML *1.2 is officially a superset of JSON*, meaning most JSON documents can be parsed as YAML.

YAML makes it easy to inspect data structures by using indentation-based scoping (similar to Python).

::: note Another Fun Fact! 🤓
DEV.to articles use YAML to define custom variables like title, description, tags, etc.
:::

## Basic Syntax

A YAML document is essentially a **collection of key-value pairs**, where values can be as simple as a string or as complex as a tree.

Here are some notes on YAML syntax:

* **Indentation is used to denote structure**. Tabs are not allowed. The number of spaces doesn't matter
  as long as child nodes are indented more than their parent nodes.
* UTF-8, UTF-16, and UTF-32 encodings are permitted.

### Strings

```md
---
# Strings do not require quotes:
title: Introduction to YAML

# But you can still use them:
title-w-quotes: 'Introduction to YAML'

# Multi-line strings start with |
execute: |
  npm ci
  npm build
  npm test
---
```

The above code converts to JSON as:

```json
{
  "title": "Introduction to YAML",
  "title-w-quotes": "Introduction to YAML",
  "execute": "npm ci\nnpm build\nnpm test\n"
}
```

### Numbers

```md
---
# Integer:
age: 29

# Float:
price: 15.99

# Scientific notation:
population: 2.89e+6
---
```

The above code converts to JSON as:

```json
{
  "age": 29,
  "price": 15.99,
  "population": 2890000
}
```

### Booleans

```md
---
# Booleans can be represented in different ways:
published: false
published: False
published: FALSE
---
```

All of the above will convert to JSON as follows:

```json
{
  "published": false
}
```

### Null Values

```md
---
# Null values can be represented by not setting a value:
null-value:

# Or more explicitly:
null-value: null
null-value: NULL
null-value: Null
---
```

All of the above will convert to JSON as follows:

```json
{
  "null-value": null
}
```

### Dates and Timestamps

Dates can be used in ISO format as shown below:

```md
---
date: 2002-12-14
canonical: 2001-12-15T02:59:43.1Z
iso8601: 2001-12-14t21:59:43.10-05:00
spaced: 2001-12-14 21:59:43.10 -5
---
```

### Sequences

Sequences allow us to define lists in YAML:

```md
---
# Numbered list using hyphens:
numbers:
  - one
  - two
  - three

# Inline version:
numbers: [ one, two, three ]
---
```

Both sequences above will parse to JSON as follows:

```json
{
  "numbers": [
    "one",
    "two",
    "three"
  ]
}
```

### Nested Values

We can use all the types mentioned above to create objects with nested values, as shown below:

```md
---
# Data for the novel Nineteen Eighty-Four.
nineteen-eighty-four:
  author: George Orwell
  published-at: 1949-06-08
  page-count: 328
  description: |
    A Novel, often published as 1984, is a dystopian novel by English novelist George Orwell.
    It was published in June 1949 by Secker & Warburg as Orwell's ninth and final book.
---
```

This converts to JSON as:

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

### Lists of Objects

Combining sequences and nested values, we can create a list of objects.

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

## Unique Features

Here are some **more complex features** that caught my attention, which also distinguish YAML from JSON.

### Comments

As you may have noticed in my previous examples, YAML allows comments starting with `#`.

```md
---
# This is a very useful comment.
---
```

### Reusability with Anchors

Node anchors are used to **mark a node** for future reference, allowing us to reuse that node.
To mark a node, we use the `&` character; to reference it, we use `*`:

In the following example, we define a list of books and reuse the author data, so we only need to define it once:

```md
---
# Author data:
author: &gOrwell
    name: George
    last-name: Orwell

# Some books:
books:
    - 1984:
        author: *gOrwell
    - animal-farm:
        author: *gOrwell
---
```

When parsed to JSON, the above code will look like this:

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

### Explicit Data Types with Tags

As we saw in previous examples, YAML automatically detects the types of our values, but we can also **specify the desired type**.

We specify it by prefixing the value with `!!` followed by the type.

Here are some examples:

```md
---
# The following value should be an integer, regardless:
should-be-int: !!int 3.2

# Parse any value as a string:
should-be-string: !!str 30.25

# I need the next value to be a boolean:
should-be-boolean: !!bool yes
---
```

This converts to JSON as:

```json
{
  "should-be-int": 3,
  "should-be-string": "30.25",
  "should-be-boolean": true
}
```
