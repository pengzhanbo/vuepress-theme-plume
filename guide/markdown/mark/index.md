---
url: /guide/markdown/mark/index.md
---
## 概述

\==马克笔== 是对 Markdown 中的的标记语法 `==Mark==` 的扩展，支持在内容中使用多种不同的颜色来标记文本，
还可以方便灵活的自定义更多不同的马克笔颜色。

## 语法

### 常规

使用 `== ==` 进行标记。请注意两边需要有空格。

**输入：**

```md
vuepress-theme-plume 是一个 ==简洁美观== 的 主题
```

**输出：**

vuepress-theme-plume 是一个 ==简洁美观== 的 主题

### 配色

不同颜色的马克笔通过 [Markdown 属性语法](./extensions.md#属性支持) 进行设置。

在 标记语法 `==Mark==` 之后紧跟 `{.classname}`，可以为马克笔设置不同的颜色。

**输入：**

```md
==一个提示=={.tip} ==一个警告=={.warning} ==一个错误=={.danger} ==重要内容=={.important}
```

**输出：**

\==一个提示=={.tip} ==一个警告=={.warning} ==一个错误=={.danger} ==重要内容=={.important}

## 内置配色

主题内置了以下的配置方案：

* **default**: `==Default==` - ==Default==
* **info**: `==Info=={.info}` - ==Info=={.info}
* **note**: `==Note=={.note}` - ==Note=={.note}
* **tip**: `==Tip=={.tip}` - ==Tip=={.tip}
* **warning**: `==Warning=={.warning}` - ==Warning=={.warning}
* **danger**: `==Danger=={.danger}` - ==Danger=={.danger}
* **caution**: `==Caution=={.caution}` - ==Caution=={.caution}
* **important**: `==Important=={.important}` - ==Important=={.important}

## 自定义配色

马克笔可以通过 [自定义样式](../custom/style.md) 的方式进行自定义。

你可以完全自定义你的马克笔颜色，包括内置的配置方案也可以进行修改。

在主题内部，马克笔通过 `类名` + `CSS 变量` 的方式进行设置。

以下是与马克笔相关的 `CSS 变量`：

* `--vp-mark-text` - 马克笔的文本颜色
* `--vp-mark-bg` - 马克笔的背景颜色
* `--vp-mark-linear-color` - 渐变颜色，仅用于内置的 `--vp-mark-bg-image` 中
* `--vp-mark-bg-shift` - 马克笔的内置渐变背景偏移
* `--vp-mark-bg-image` - 马克笔的背景图片

### 修改内置配色

以下是主题内置的马克笔颜色配置，你可以把它们复制到你的 [样式文件](../custom/style.md#style-文件) 中进行修改。

```css :collapsed-lines
mark {
  --vp-mark-text: currentcolor;
  --vp-mark-bg: transparent;
  --vp-mark-bg-shift: 0.55lh;
  --vp-mark-linear-color: var(--vp-c-brand-3);
  --vp-mark-bg-image: linear-gradient(to right, var(--vp-mark-linear-color) 50%, transparent 50%);
  animation: var(--vp-mark-animation, mark-highlight 1.5s 0.5s forwards);
}

[data-mark-mode="lazy"] mark {
  --vp-mark-animation: none;
}

[data-mark-mode="lazy"] mark.vp-mark-visible {
  animation: mark-highlight 1.5s 0.2s forwards;
}

mark.note {
  --vp-mark-linear-color: #ff0;
}

mark.info {
  --vp-mark-linear-color: var(--vp-c-default-1);
}

mark.tip {
  --vp-mark-linear-color: #39ff14;
}

mark.warning {
  --vp-mark-linear-color: #fc0;
}

mark.caution, mark.danger {
  --vp-mark-linear-color: #f99;
}

mark.important {
  --vp-mark-linear-color: #ccf;
}

[data-theme="dark"] mark.note {
  --vp-mark-linear-color: #660;
}

[data-theme="dark"] mark.tip {
  --vp-mark-linear-color: #063;
}

[data-theme="dark"] mark.warning {
  --vp-mark-linear-color: #c60;
}

[data-theme="dark"] mark.caution,
[data-theme="dark"] mark.danger {
  --vp-mark-linear-color: #c66;
}

[data-theme="dark"] mark.important {
  --vp-mark-linear-color: #66c;
}
```

### 添加配色

在 [样式文件](../custom/style.md#style-文件) 中，通过以下格式添加新的配色:

```css
mark.classname {
  --vp-mark-text: marktext;  /* 文本颜色 */
  --vp-mark-bg-image: none;  /* 背景图片 */
  --vp-mark-bg: mark;        /* 背景颜色 */
  --vp-mark-linear-color: mark;  /* 渐变颜色 */
}
```

然后在 Markdown 中使用 `==Mark=={.classname}` 进行标记。

你可以随意命名 `classname`，除了修改 CSS 变量，也可以添加其他的 CSS 样式属性。

## 动画模式

默认情况下，马克笔会在页面渲染时立即播放描线动画。

如果希望在滚动到可视区域后再播放动画，可以在主题配置中将 `markdown.mark` 设置为 `'lazy'`：

```ts title=".vuepress/config.ts" {5}
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      mark: 'lazy',
    },
  }),
})
```
