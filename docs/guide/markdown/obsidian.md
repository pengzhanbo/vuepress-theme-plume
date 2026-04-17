---
title: Obsidian 兼容
icon: simple-icons:obsidian
createTime: 2026/04/17 21:56:55
permalink: /guide/markdown/obsidian/
---

## 概述

主题通过 `vuepress-plugin-md-power` 插件提供对 Obsidian 官方 Markdown 扩展语法的兼容性支持，使 Obsidian 用户能够以熟悉的语法撰写文档。

当前已支持的 Obsidian 扩展语法包括：

- [Wiki 链接](#wiki-链接) - 页面间相互链接的语法
- [嵌入内容](#嵌入内容) - 将其他文件内容嵌入到当前页面
- [注释](#注释) - 添加仅在编辑时可见的注释

::: warning 不计划对 obsidian 社区的第三方插件提供的扩展语法进行支持
:::

## Wiki 链接

Wiki 链接是 Obsidian 中用于链接到其他笔记的语法。

### 语法

```md
[[文件名]]
[[文件名#标题]]
[[文件名#标题#子标题]]
[[文件名|别名]]
[[文件名#标题|别名]]
```

### 文件名搜索规则

当使用 Wiki 链接时，文件名会按照以下规则进行搜索匹配：

**匹配优先级：**

1. **页面标题** - 优先匹配页面的标题
2. **完整路径** - 精确匹配文件路径
3. **模糊匹配** - 匹配路径结尾的文件名

**路径解析规则：**

- **相对路径**（以 `.` 开头）：相对于当前文件所在目录解析
- **绝对路径**（不以 `.` 开头）：在整个文档树中搜索，优先匹配最短路径
- **目录形式**（以 `/` 结尾）：匹配该目录下的 `README.md` 或 `index.html`

**示例：**

假设文档结构如下：

```txt
docs/
├── README.md          (title: "首页")
├── guide/
│   ├── README.md     (title: "指南")
│   └── markdown/
│       └── obsidian.md
```

在 `docs/guide/markdown/obsidian.md` 中：

| 语法         | 匹配结果                                         |
| ------------ | ------------------------------------------------ |
| `[[首页]]`   | 匹配 `docs/README.md`（通过标题）                |
| `[[指南]]`   | 匹配 `docs/guide/README.md`（通过标题）          |
| `[[./]]`     | 匹配 `docs/guide/markdown/README.md`（相对路径） |
| `[[../]]`    | 匹配 `docs/guide/README.md`（上级目录）          |
| `[[guide/]]` | 匹配 `docs/guide/README.md`（目录形式）          |

### 示例

**外部链接：**

**输入：**

```md
[[https://example.com|外部链接]]
```

**输出：**

[[https://example.com|外部链接]]

**内部锚点链接：**

**输入：**

```md
[[二维码]]  <!-- 通过标题检索 -->
[[npm-to]]  <!-- 通过文件名检索 -->
[[guide/markdown/math]]  <!-- 通过文件路径检索-->
[[#Wiki 链接]]  <!-- 当前页面使用 heading -->
[[file-tree#配置]]  <!-- 通过文件名检索，并链接到 heading -->
```

**输出：**

[[二维码]]

[[npm-to]]

[[guide/markdown/math]]

[[#Wiki 链接]]

[[file-tree#配置]]

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
![[image.png]]
![[image.png|300]]
![[image.png|300x200]]
```

支持格式：`jpg`, `jpeg`, `png`, `gif`, `avif`, `webp`, `svg`, `bmp`, `ico`, `tiff`, `apng`, `jfif`, `pjpeg`, `pjp`, `xbm`

**输入：**

```md
![[images/custom-hero.jpg]]
```

**输出：**

![[images/custom-hero.jpg]]

### PDF 嵌入

> [!NOTE]
> PDF 嵌入需要启用 `markdown.pdf` 插件才能正常工作。

**语法：**

```md
![[document.pdf]]
![[document.pdf#page=1]] <!-- #page=1 表示第一页 -->
![[document.pdf#page=1#height=300]] <!-- #height=300 表示高度为 300px -->
```

---

### 音频嵌入

> [!note]
> 音频嵌入需要确保文件路径正确，文件存在于文档目录中。

**输入：**

```md
![[audio.mp3]]
```

**输出：**

![[https://publish-01.obsidian.md/access/cf01a21839823cd6cbe18031acf708c0/Attachments/audio/Excerpt%20from%20Mother%20of%20All%20Demos%20(1968).ogg]]

支持格式：`mp3`, `flac`, `wav`, `ogg`, `opus`, `webm`, `acc`

---

### 视频嵌入

> [!note]
> 视频嵌入需要启用 `markdown.artPlayer` 插件才能正常工作。

**输入：**

```md
![[video.mp4]]
```

**输出：**

![[https://artplayer.org/assets/sample/video.mp4]]

支持格式：`mp4`, `webm`, `mov` 等

---

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

---

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

可以跨越多行。
%%

注释之后的内容

[Obsidian 官方 - 注释](https://obsidian.md/zh/help/syntax#%E6%B3%A8%E9%87%8A){.readmore}

## 配置

你可以在主题配置中启用或禁用这些插件：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      mdPower: {
        // Obsidian 兼容插件配置
        obsidian: {
          wikiLink: true,    // Wiki 链接
          embedLink: true,   // 嵌入内容
          comment: true,     // 注释
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
启用 Wiki 链接语法
:::

::: field name="embedLink" type="boolean" default="true" optional
启用嵌入内容语法
:::

::: field name="comment" type="boolean" default="true" optional
启用注释语法
:::

::::

## 注意事项

- 这些插件提供的是 **兼容性支持**，并非完全实现 Obsidian 的全部功能
- 部分 Obsidian 特有的功能（如内部链接的图谱视图、双向链接等）不在支持范围内
- 嵌入内容时，被嵌入的页面也会参与主题的构建过程
- PDF 嵌入需要同时启用 `pdf` 插件
- 视频嵌入需要同时启用 `artPlayer` 插件
