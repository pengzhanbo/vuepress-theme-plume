---
url: /guide/markdown/timeline/index.md
---
## 概述

在 markdown 中，使用 `::: timeline` 容器，包含 markdown 无序列表语法，即可实现 ==时间线== 的 渲染效果。

* 支持 ==水平方向== 和 ==垂直方向==
* 垂直方向支持 **左对齐**，**右对齐** 和 **两端对齐**
* 支持 **图标** 和 **线条样式**
* 支持 通过预设 **类型** 设置 **颜色**，支持自定义颜色

## 启用

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      timeline: true, // [!code ++]
    }
  })
})
```

## 使用

在 `::: timeline` 容器中，使用 markdown 无序列表语法，列表的每一个项即 时间线上的每一个点。

```md{1,9} title="timeline.md"
::: timeline 配置
- 标题
  配置

  正文内容

- 标题
  配置

  正文内容
:::
```

对于列表的每一个项：

* 从 **首行开始** 到 **首个空行**，均为 **标题** ，在标题后紧跟随的一行，用于 **配置** 当前项的行为

* **首个空行之后**: 正文内容

:::important 请注意添加正确的缩进
:::

**一个简单的例子：**

**输入：**

```md
::: timeline
- 节点一
  time=2025-03-20 type=success

  正文内容

- 节点二
  time=2025-02-21 type=warning

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容
:::
```

**输出：**

::: timeline

* 节点一
  time=2025-03-20 type=success

  正文内容

* 节点二
  time=2025-02-21 type=warning

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容
  :::

::: important 时间线默认为垂直方向
:::

## 配置

**时间线** 支持非常灵活且灵活的配置项，配置主要分为两个部分：

* **容器配置**： 在 `::: timeline` 容器上的配置，配置项跟随在 `::: timeline` 之后，如：

  `::: timeline horizontal` 表示 渲染为 水平方向的时间线。

* **列表项配置**： 列表的每一个项的配置，紧跟随在标题之后的一行，如：

  ```md
  ::: timeline
  - 标题                          <!--标题行-->
    也是标题                      <!--标题行-->
    time=2025-03-20 type=success  <!--配置跟随在最后的标题行之后的单独一行，可选-->
                                  <!--空行，有正文时必须-->
    正文内容
  :::
  ```

### 容器配置

:::: field-group

::: field name="horizontal" type="boolean" default="false" optional
渲染为 水平方向 的时间线
:::

::: field name="card" type="boolean" default="false" optional
每个时间节点默认渲染为卡片样式（可在列表项配置中覆盖）
:::

::: field name="placement" type="'left' | 'right' | 'between'" default="'left'" optional

时间节点的对齐方式。==仅在垂直方向时生效=={.warning}

* `left` : 时间轴左侧对齐
* `right` : 时间轴右侧对齐
* `between` : 时间轴两端对齐 (通过列表项配置中的 `placement` 定义位置，默认为 `left`)
  :::

::: field name="line" type="'solid' | 'dashed' | 'dotted'" default="'solid'" optional
线条样式（可在列表项配置中覆盖）
:::

::::

### 列表项配置

:::: field-group

::: field name="time" type="string" default="''" optional
时间点，可以是任何字符串，比如 `2025-03-20`， `Q1` 等。
:::

::: field name="type" type="'info' | 'tip' | 'success' | 'warning' | 'danger' | 'caution' | 'important'" default="'info'" optional
时间节点的类型。
:::

::: field name="card" type="boolean" default="false" optional
当前 时间节点渲染为卡片样式。默认值从 容器配置 `card` 中继承
:::

::: field name="line" type="'solid' | 'dashed' | 'dotted'" default="'solid'" optional
线条样式。 默认值从 容器配置 `line` 中继承
:::

::: field name="icon" type="string" default="''" optional
时间节点的图标，支持所有的 [iconify](https://icon-sets.iconify.design/) 图标。
:::

::: field name="placement" type="'left' | 'right'" default="'left'" optional

当 容器配置 `placement` 为 `between` 时，定义当前时间节点的位置。

* `left` : 在时间轴左侧
* `right` : 在时间轴右侧
  :::

::: field name="color" type="string" default="''" optional
时间节点线条颜色，可以是任何有效的颜色值。
:::

::::

## 示例

### 水平方向

在 `:::timeline` 后跟随声明 `horizontal` , 即可将时间线渲染为 水平方向。

**输入：**

```md /horizontal/
::: timeline horizontal
- 节点一
  time=2025-03-20

  正文内容

- 节点二
  time=2025-04-20 type=success

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容

- 节点四
  time=2025-01-22 type=important

  正文内容
:::
```

**输出：**

::: timeline horizontal

* 节点一
  time=2025-03-20

  正文内容

* 节点二
  time=2025-04-20 type=success

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容

* 节点四
  time=2025-01-22 type=important

  正文内容
  :::

### 右对齐

在 `:::timeline` 后跟随声明 `placement="right"` , 即可将时间线渲染为 右对齐。

**输入：**

```md /placement="right"/
::: timeline placement="right"
- 节点一
  time=2025-03-20

  正文内容

- 节点二
  time=2025-04-20 type=success

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容

- 节点四
  time=2025-01-22 type=important

  正文内容
:::
```

**输出：**

::: timeline placement="right"

* 节点一
  time=2025-03-20

  正文内容

* 节点二
  time=2025-04-20 type=success

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容

* 节点四
  time=2025-01-22 type=important

  正文内容
  :::

### 两端对齐

在 `:::timeline` 后跟随声明 `placement="between"` , 即可将时间线渲染为 两端对齐。

列表项默认位于时间线的左侧，可以通过 `placement="right"` 为列表项设置右侧位置。

**输入：**

```md /placement="between"/ /placement=right/
::: timeline placement="between"
- 节点一
  time=2025-03-20 placement=right

  正文内容

- 节点二
  time=2025-04-20 type=success

  正文内容

- 节点三
  time=2025-01-22 type=danger placement=right

  正文内容

- 节点四
  time=2025-01-22 type=important

  正文内容
:::
```

**输出：**

::: timeline placement="between"

* 节点一
  time=2025-03-20 placement=right

  正文内容

* 节点二
  time=2025-04-20 type=success

  正文内容

* 节点三
  time=2025-01-22 type=danger placement=right

  正文内容

* 节点四
  time=2025-01-22 type=important

  正文内容
  :::

### 节点类型

在列表项配置中，添加 `type=节点类型` 可以为当前节点设置节点类型。

**输入：**

```md /type=success/ /type=warning/ /type=danger/ /type=important/
::: timeline
- 节点一
  time=2025-03-20 type=success

  正文内容

- 节点二
  time=2025-04-20 type=warning

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容

- 节点四
  time=2025-01-22 type=important

  正文内容
:::
```

**输出：**

::: timeline

* 节点一
  time=2025-03-20 type=success

  正文内容

* 节点二
  time=2025-04-20 type=warning

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容

* 节点四
  time=2025-01-22 type=important

  正文内容
  :::

### 线条风格

* 在容器配置中添加 `line=线条风格` 可以为所有节点设置默认线条风格。
* 在列表项配置中，添加 `line=线条风格` 可以为节点设置线条风格。

**输入：**

```md /line="dotted"/ /line=solid/ /line=dashed/
::: timeline line="dotted"
- 节点一
  time=2025-03-20

  正文内容

- 节点二
  time=2025-04-20 type=success

  正文内容

- 节点三
  time=2025-01-22 type=danger line=dashed

  正文内容

- 节点四
  time=2025-01-22 type=important line=solid

  正文内容
:::
```

**输出：**

::: timeline line="dotted"

* 节点一
  time=2025-03-20

  正文内容

* 节点二
  time=2025-04-20 type=success

  正文内容

* 节点三
  time=2025-01-22 type=danger line=dashed

  正文内容

* 节点四
  time=2025-01-22 type=important line=solid

  正文内容
  :::

### 带图标的节点

在列表项配置中，添加 `icon=图标名称` 可以为节点添加图标。

图标名称支持 [iconify](https://icon-sets.iconify.design/) 的图标名称。

**输入：**

```md /icon=mdi:balloon/ /icon=mdi:bookmark/
::: timeline placement="between"
- 节点一
  time=2025-03-20 placement=right icon=mdi:balloon

  正文内容

- 节点二
  time=2025-04-20 type=success icon=mdi:bookmark

  正文内容

- 节点三
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  正文内容

- 节点四
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  正文内容
:::
```

**输出：**

::: timeline placement="between"

* 节点一
  time=2025-03-20 placement=right icon=mdi:balloon

  正文内容

* 节点二
  time=2025-04-20 type=success icon=mdi:bookmark

  正文内容

* 节点三
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  正文内容

* 节点四
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  正文内容
  :::

### 卡片节点

卡片节点可以很灵活的进行控制：

* 在 容器配置中添加 `card` 即可使每个列表项都是卡片节点。
* 在列表项配置中，添加 `card=true` 即可为节点设置为卡片节点。
* 在列表项配置中，添加 `card=false` 即可为节点设置为非卡片节点。

卡片节点的样式会受到 `type` 配置的影响。

::: tip 在列表项配置中添加 `card=true` / `card=false` 可以覆盖容器节点的 `card` 配置
:::

**输入：**

```md{1} /card=false/
::: timeline card
- 节点一
  time=2025-03-20

  正文内容

- 节点二
  time=2025-04-20 type=success card=false

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容

- 节点四
  time=2025-01-22 type=important

  正文内容
:::
```

**输出：**

::: timeline card

* 节点一
  time=2025-03-20

  正文内容

* 节点二
  time=2025-04-20 type=success card=false

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容

* 节点四
  time=2025-01-22 type=important

  正文内容
  :::

## 自定义节点类型

时间轴的节点类型是通过 CSS Variables 控制的，主题提供了以下的 CSS 变量：

```css
:root {
  --vp-timeline-c-line: var(--vp-c-border);   /* 线条颜色 */
  --vp-timeline-c-point: var(--vp-c-border);  /* 点颜色 */
  --vp-timeline-c-title: var(--vp-c-text-1);  /* 标题文本颜色 */
  --vp-timeline-c-text: var(--vp-c-text-1);   /* 正文文本颜色 */
  --vp-timeline-c-time: var(--vp-c-text-3);   /* 时间文本颜色 */
  --vp-timeline-c-icon: var(--vp-c-bg);       /* 图标颜色 */
  --vp-timeline-bg-card: var(--vp-c-bg-soft); /* 卡片节点的背景颜色 */
}
```

比如主题内置的节点类型 `tip`:

```css /.tip/
.vp-timeline-item.tip {
  --vp-timeline-c-line: var(--vp-c-tip-1);
  --vp-timeline-c-point: var(--vp-c-tip-1);
  --vp-timeline-bg-card: var(--vp-c-tip-soft);
}
```

可以在 [自定义样式](../custom/style.md) 中，覆盖内置的类型，或者添加新的类型。

**示例：**

```css title=".vuepress/styles/index.css"
.vp-timeline-item.your-type {
  --vp-timeline-c-line: #3cf;
  --vp-timeline-c-point: #3cf;
  --vp-timeline-bg-card: rgba(60, 252, 255, 0.314);
}
```

```md /type=your-type/
::: timeline
- 节点一
  time=2025-03-20

  正文内容

- 节点二
  time=2025-04-20 type=your-type card=true

  正文内容

- 节点三
  time=2025-01-22 type=danger

  正文内容
:::
```

::: timeline

* 节点一
  time=2025-03-20

  正文内容

* 节点二
  time=2025-04-20 type=your-type card=true

  正文内容

* 节点三
  time=2025-01-22 type=danger

  正文内容
  :::
