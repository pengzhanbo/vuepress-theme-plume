---
url: /guide/markdown/extensions/index.md
---
## 标题锚点

标题会自动应用锚点。

### 自定义锚点

要为标题指定自定义锚点而不是使用自动生成的锚点，请向标题添加后缀：

```md
# 使用自定义锚点 {#my-anchor}
```

这允许将标题链接为 `#my-anchor`，而不是默认的 `#使用自定义锚点`。

## 链接

内部和外部链接都会被特殊处理。

主题默认对每个 md 文件自动生成一个新的 链接，并保存在对应的 md 文件的 frontmatter 的 `permalink` 中。
你可以随时修改它们。你也可以通过 `theme.autoFrontmatter` 选项来禁用这个功能，这时会恢复为 VuePress 的默认行为。

### 内部链接

有三种方式来使用内部链接：

* 使用 生成的 `permalink` 作为内部链接的目标。
* 使用 md 文件的相对路径作为内部链接的目标。
* 使用 md 文件的绝对路径作为内部链接的目标， 绝对路径 `/` 表示从 `${sourceDir}` 目录开始。

```md
[Markdown](/guide/markdown/)

[Markdown](./basic.md)
```

渲染为：

[Markdown](/guide/markdown/)

[Markdown](./basic.md)

### 外部链接

外部链接带有 `target="_blank" rel="noreferrer"` ：

[VuePress](https://v2.vuepress.vuejs.org/)

## Github风格的表格

**输入：**

```md
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

**输出：**

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## 目录表

**输入：**

```md
[[TOC]]
```

**输出：**

\[\[TOC]]

## 上下角标

* 使用 `^ ^` 进行上角标标注。
* 使用 `~ ~` 进行下角标标注。

**输入：**

```md
- 19^th^
- H~2~O
```

**输出：**

* 19^th^
* H~2~O

## 自定义对齐

**输入：**

```md
::: left
左对齐的内容
:::

::: center
居中的内容
:::

::: right
右对齐的内容
:::
```

**输出：**

::: left
左对齐的内容
:::

::: center
居中的内容
:::

::: right
右对齐的内容
:::

## 任务列表

**输入：**

```md
- [ ] 任务 1
- [x] 任务 2
- [ ] 任务 3
```

**输出：**

* \[ ] 任务 1
* \[x] 任务 2
* \[ ] 任务 3

## 脚注

**输入：**

```md
人生自古谁无死，留取丹心照汗青[^脚注1]。

[^脚注1]: 出自 宋·文天祥 **《过零丁洋》**
```

**输出：**

人生自古谁无死，留取丹心照汗青\[^脚注1]。

\[^脚注1]: 出自 宋·文天祥 **《过零丁洋》**
