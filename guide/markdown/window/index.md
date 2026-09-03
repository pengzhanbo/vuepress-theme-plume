---
url: /guide/markdown/window/index.md
---
## 概述

有时候，你可能需要在 内容中补充一些 示例，但期望能与 其它内容 分隔开来呈现。
主题支持在 Markdown 文件中添加示例窗口容器。

## 语法

```md
::: window
添加你的示例
:::
```

## 选项

* `title="xxx"`：标题
* `height="200px"`: 高度
* `gap="20px"`: 左右内边距

## 示例

仅包含图片:

```md
::: window
![hero](/images/custom-hero.jpg)
:::
```

**输出：**
::: window
![hero](/images/custom-hero.jpg)
:::

包含 markdown 语法：

```md
::: window title="标题"
### 三级标题

这是示例容器中的内容。
:::
```

**输出：**
::: window title="标题"

### 三级标题

这是示例容器中的内容。
:::

包含 html /vue 代码：

```md
::: window
<h2 class="your-demo-title">这是标题</h2>
<p class="your-demo-paragraph">这是段落</p>

<style>
  .your-demo-title {
    color: red;
  }
  .your-demo-paragraph {
    color: blue;
  }
</style>
:::
```

**输出：**
::: window

:::
