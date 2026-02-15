---
url: /guide/markdown/qrcode/index.md
---
@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)

## 概述

在 Markdown 中，通过简单的语法，可以在文档中插入由文本转换成的二维码图片，以便在需要时进行扫描。

文本可以是：

* 远程可访问的链接地址
* vuepress 站点内的 `.md` 文件路径 *（绝对路径 或相对路径 均支持）*
* 任意普通文本 （避免过长的文本）

## 配置

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      qrcode: true, // [!code ++]
    }
  })
})
```

## 语法

### 单行语法

单行语法适用于 `text` 文本较短时，比如 链接 等。

```md
<!-- 基础语法-->
@[qrcode](text)
<!-- 添加属性 -->
@[qrcode card svg title="xxx" align="center"](text)
```

### 容器语法

容器语法适用于 `text` 文本较长时，比如 段落，多行文本 等。

```md
::: qrcode card svg title="xxx" align="center"
text
:::
```

::: warning 过长的文本生成的二维码可能会被截断，且可能无法扫描
:::

## 属性

:::: field-group
::: field name="card" type="boolean" optional default="false"
是否启用卡片样式。
:::
::: field name="svg" type="boolean" optional default="false"
是否将二维码渲染为 SVG 格式。默认渲染为 PNG 格式。
:::
::: field name="title" type="string" optional
二维码标题。
:::
::: field name="align" type="'left' | 'center' | 'right'" optional default="left"
二维码对齐方式。
:::
::: field name="width" type="number" optional default="300"
二维码宽度。
:::
::::

以下属性配置将直接影响二维码的最终渲染效果，通常使用默认值即可，无需配置。

:::: field-group
::: field name="light" type="string" optional default="#ffffffff"
二维码亮色部分颜色，即背景色
:::
::: field name="dark" type="string" optional default="#000000ff"
二维码暗色部分颜色，即二维码颜色
:::
::: field name="margin" type="number" optional default="2"
二维码边距
:::
::: field name="level" type="'L' | 'M' | 'Q' | 'H'" optional default="M"
**纠错等级**

纠错能力使得即使二维码符号被污染或损坏，也能成功扫描。根据操作环境，有四个级别可供选择。

更高级别提供更好的抗错能力，但会降低符号的容量。

如果二维码符号可能被损坏的几率较低，则可以安全使用低纠错级别，如低或中。
:::
::: field name="version" type="number" optional
**二维码版本**

若未指定，将自动计算更合适的值。取值范围 `1-40`。
:::
::: field name="scale" type="number" optional default="4"
缩放因子。值为 1 表示每个模块（黑点）对应 1 像素。
:::
::: field name="mask" type="1 | 2 | 3 | 4 | 5 | 6 | 7" optional
用于遮蔽符号的掩码模式。

若未指定，将自动计算更合适的值。
::::

## 示例

### 可访问的远程链接

**输入：**

```md
@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)
```

**输出：**

@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)

### 站内的页面路径

**输入：**

```md
@[qrcode](.) <!-- `.` 表示当前页面地址 -->
@[qrcode](./steps.md) <!-- 相对路径 -->
@[qrcode](/guide/markdown/qrcode.md) <!-- 绝对路径 -->
```

**输出：**

::: flex
@[qrcode](.)
@[qrcode](./steps.md)
@[qrcode](/guide/markdown/qrcode.md)
:::

### 任意文本

**输入：**

```md
@[qrcode](vuepress-theme-plume 是一款开源的 VuePress 主题)
```

**输出：**

@\[qrcode]\(vuepress-theme-plume 是一款开源的 VuePress 主题)

**输入：**

```md
::: qrcode title="宣州谢朓楼饯别校书叔云 <唐·李白>"
弃我去者，昨日之日不可留。
乱我心者，今日之日多烦忧。
长风万里送秋雁，对此可以酣高楼。
蓬莱文章建安骨，中间小谢又清发。
俱怀逸兴壮思飞，欲上青天览明月。
抽刀断水水更流，举杯消愁愁更愁。
人生在世不称意，明朝散发弄扁舟。
:::
```

**输出：**

::: qrcode title="宣州谢朓楼饯别校书叔云 <唐·李白>"
弃我去者，昨日之日不可留。
乱我心者，今日之日多烦忧。
长风万里送秋雁，对此可以酣高楼。
蓬莱文章建安骨，中间小谢又清发。
俱怀逸兴壮思飞，欲上青天览明月。
抽刀断水水更流，举杯消愁愁更愁。
人生在世不称意，明朝散发弄扁舟。
:::

### 带信息的二维码卡片

**输入：**

```md
@[qrcode card title="vuepress-theme-plume"](https://github.com/pengzhanbo/vuepress-theme-plume)
```

等同于：

```md
::: qrcode card title="vuepress-theme-plume"
https://github.com/pengzhanbo/vuepress-theme-plume
:::
```

**输出：**

@[qrcode card title="vuepress-theme-plume"](https://github.com/pengzhanbo/vuepress-theme-plume)
