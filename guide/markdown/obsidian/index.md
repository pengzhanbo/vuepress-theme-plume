---
url: /guide/markdown/obsidian/index.md
---
## 概述

主题通过 `vuepress-plugin-md-power` 插件提供对 Obsidian 官方 Markdown 扩展语法的兼容性支持，使 Obsidian 用户能够以熟悉的语法撰写文档。

当前已支持的 Obsidian 扩展语法包括：

* [Wiki 链接](#wiki-链接) - 页面间相互链接的语法
* [嵌入内容](#嵌入内容) - 将其他文件内容嵌入到当前页面
* [Callout](#callout) - 使用样式容器突出显示重要信息
* [注释](#注释) - 添加仅在编辑时可见的注释

::: warning 不计划支持 Obsidian 社区第三方插件提供的扩展语法
:::

## 配置

Obsidian 兼容功能默认全部启用，你可以通过配置选择性地启用或禁用：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      mdPower: {
        obsidian: {
          wikiLink: true,    // Wiki 链接
          embedLink: true,  // 嵌入内容
          callout: true,    // Callout
          comment: true,    // 注释
        },
        pdf: true,          // PDF 嵌入功能
        artPlayer: true,    // 视频嵌入功能
      }
    }
  })
})
```

### 配置项

:::: field-group

::: field name="wikiLink" type="boolean" default="true" optional
启用 [Wiki 链接](#wiki-链接) 语法。
:::

::: field name="embedLink" type="boolean" default="true" optional
启用 [嵌入内容](#嵌入内容) 语法。
:::

::: field name="callout" type="boolean" default="true" optional
启用 [Callout](#callout) 语法。
:::

::: field name="comment" type="boolean" default="true" optional
启用 [注释](#注释) 语法。
:::

::::

## Wiki 链接

Wiki 链接是 Obsidian 中用于链接到其他笔记的语法。使用双括号 `[[]]` 包裹内容来创建内部链接。

### 语法

```md
[[文件名]]
[[文件名#标题]]
[[文件名#标题#子标题]]
[[文件名|别名]]
[[文件名#标题|别名]]
[[https://example.com|外部链接]]
```

### 文件名搜索规则

当使用 Wiki 链接时，文件名会按照以下规则进行搜索匹配：

**匹配优先级：**

1. **完整路径** - 精确匹配文件路径
2. **模糊匹配** - 匹配路径结尾的文件名，优先匹配最短路径

**路径解析规则：**

* **相对路径**（以 `.` 开头）：相对于当前文件所在目录解析
* **绝对路径**（不以 `.` 开头）：在整个文档树中搜索，优先匹配最短路径
* **目录形式**（以 `/` 结尾）：匹配该目录下的 `README.md`

**示例：**

假设文档结构如下：

```txt
docs/
├── README.md
├── guide/
│   ├── README.md
│   └── markdown/
│       └── obsidian.md
```

在 `docs/guide/markdown/obsidian.md` 中：

| 语法           | 匹配结果                                                 |
| -------------- | -------------------------------------------------------- |
| `[[obsidian]]` | 匹配 `docs/guide/markdown/obsidian.md`（通过文件名检索） |
| `[[./]]`       | 匹配 `docs/guide/markdown/README.md`（相对路径）         |
| `[[../]]`      | 匹配 `docs/guide/README.md`（上级目录）                  |
| `[[guide/]]`   | 匹配 `docs/guide/README.md`（目录形式）                  |

### 示例

**外部链接：**

**输入：**

```md
[[https://example.com|外部链接]]
```

**输出：**

\[\[https://example.com|外部链接]]

**内部锚点链接：**

**输入：**

```md
[[npm-to]]  <!-- 通过文件名检索 -->
[[guide/markdown/math]]  <!-- 通过文件路径检索-->
[[#Wiki 链接]]  <!-- 当前页面使用 heading -->
[[file-tree#配置]]  <!-- 通过文件名检索，并链接到 heading -->
```

**输出：**

\[\[npm-to]]

\[\[guide/markdown/math]]

\[\[#Wiki 链接]]

\[\[file-tree#配置]]

[Obsidian 官方 - **Wiki Links**](https://obsidian.md/zh/help/links){.readmore}

## 嵌入内容

嵌入语法允许你将其他文件资源插入到当前页面中。

### 语法

```md
![[文件名]]
![[文件名#标题]]
![[文件名#标题#子标题]]
```

文件名搜索规则与 [Wiki 链接](#文件名搜索规则) 相同。

::: info 以 `/` 开头或 无路径前缀如 `./` 形式的，从 `public` 目录中加载资源
:::

### 图片嵌入

**语法：**

```md
![[图片]]
![[图片|宽度]]
![[图片|宽度x高度]]
```

支持格式：`jpg`、`jpeg`、`png`、`gif`、`avif`、`webp`、`svg`、`bmp`、`ico`、`tiff`、`apng`、`jfif`、`pjpeg`、`pjp`、`xbm`

**示例：**

::: demo markdown title="基础图片" expanded

```md
![[images/custom-hero.jpg]]
```

:::

::: demo markdown title="设置宽度" expanded

```md
![[images/custom-hero.jpg|300]]
```

:::

::: demo markdown title="设置宽度和高度" expanded

```md
![[images/custom-hero.jpg|300x200]]
```

:::

### PDF 嵌入

> \[!NOTE]
> PDF 嵌入需要启用 `markdown.pdf` 插件才能正常工作。

**语法：**

```md
![[文档.pdf]]
![[文档.pdf#page=1]]  <!-- #page=1 表示第一页 -->
![[文档.pdf#page=1#height=300]]  <!-- #page=页码 #height=高度 -->
```

支持格式：`pdf`

***

### 音频嵌入

**语法：**

```md
![[音频文件]]
```

支持格式：`mp3`、`flac`、`wav`、`ogg`、`opus`、`webm`、`acc`

***

### 视频嵌入

> \[!NOTE]
> 视频嵌入需要启用 `markdown.artPlayer` 插件才能正常工作。

**语法：**

```md
![[视频文件]]
![[视频文件#height=400]]  <!-- 设置视频高度 -->
```

支持格式：`mp4`、`webm`、`mov` 等

***

### 内容片段嵌入

通过 `#标题` 可以嵌入指定标题下的内容片段：

**输入：**

```md
![[我的笔记]]
![[我的笔记#标题一]]
![[我的笔记#标题一#子标题]]
```

[Obsidian 官方 - 插入文件](https://obsidian.md/zh/help/embeds){.readmore}
[Obsidian 官方 - 文件格式](https://obsidian.md/zh/help/file-formats){.readmore}

## Callout

Callout 是一种用于突出显示重要信息的语法，类似于 VuePress 的 `::: hint` 提示框语法。

### 语法

```md
> [!note]
> 内容
```

**可选标题：**

```md
> [!tip] 自定义标题
> 内容
```

### 类型

Callout 支持以下类型，别名会自动映射到对应的主要类型：

| 类型 | 别名 | 说明 |
| ---- | ---- | ---- |
| `note` | `quote`, `cite` | 笔记、引用 |
| `tip` | `hint` | 技巧、提示 |
| `info` | `todo` | 信息、待办 |
| `success` | `check`, `done` | 成功、完成 |
| `warning` | `question`, `help`, `faq` | 警告、问题、帮助 |
| `caution` | `attention`, `failure`, `fail`, `missing`, `danger`, `error`, `bug` | 注意、失败、危险 |
| `important` | `example` | 重要、示例 |
| `details` | `abstract`, `summary`, `tldr` | 详情、摘要 |

### 示例

**基础用法：**

**输入：**

```md
> [!NOTE]
> 这是一个笔记提示框。
```

**输出：**

> \[!NOTE]
> 这是一个笔记提示框。

***

**带标题：**

**输入：**

```md
> [!TIP] 实用技巧
> 使用 `pnpm` 可以显著加快依赖安装速度。
```

**输出：**

> \[!TIP] 实用技巧
> 使用 `pnpm` 可以显著加快依赖安装速度。

***

**多种类型：**

**输入：**

```md
> [!success]
> 操作成功完成！
>
> [!warning]
> 这是一个警告信息。
>
> [!caution]
> 请谨慎操作，此操作不可撤销。
```

**输出：**

> \[!success]
> 操作成功完成！

> \[!warning]
> 这是一个警告信息。

> \[!caution]
> 请谨慎操作，此操作不可撤销。

***

**Details 类型：**

`details` 类型会渲染为 HTML `<details>` 元素，支持折叠展开：

**输入：**

```md
> [!details]
> 点我展开更多内容
>
> 这是一段隐藏的内容。
```

**输出：**

> \[!details]
> 点我展开更多内容
>
> 这是一段隐藏的内容。

[Obsidian 官方 - Callout](https://obsidian.md/zh/help/callouts){.readmore}

## 注释

使用 `%%` 包裹的内容会被当作注释，不会渲染到页面中。

### 语法

**行内注释：**

```md
这是一个 %%行内注释%% 示例。
```

**块级注释：**

```md
%%
这是一个块级注释。
可以跨越多行。
%%
```

### 示例

**行内注释：**

**输入：**

```md
这是一个 %%行内注释%% 示例。
```

**输出：**

这是一个 %%行内注释%% 示例。

***

**块级注释：**

**输入：**

```md
注释之前的内容

%%
这是一个块级注释。

可以跨越多行。
%%

注释之后的内容
```

**输出：**

注释之前的内容

%%
这是一个块级注释。
%%

可以跨越多行。

[Obsidian 官方 - 注释](https://obsidian.md/zh/help/syntax#%E6%B3%A8%E9%87%8A){.readmore}

## 注意事项

* 这些插件提供的是 **兼容性支持**，并非完全实现 Obsidian 的全部功能
* 部分 Obsidian 特有的功能（如内部链接的图谱视图、双向链接等）不在支持范围内
* 嵌入内容时，被嵌入的页面也会参与主题的构建过程
* PDF 嵌入需要同时启用 `markdown.pdf` 插件
* 视频嵌入需要同时启用 `markdown.artPlayer` 插件
* 以 `/` 开头或使用 `./` 形式的嵌入资源会从 `public` 目录加载
