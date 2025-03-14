---
title: 链接卡片
author: pengzhanbo
icon: solar:card-send-linear
createTime: 2024/08/18 23:14:00
permalink: /guide/components/link-card/
---

## 概述

使用 `<LinkCard>` 组件在页面中显示链接卡片。

## Props

| 名称        | 类型                        | 默认值 | 说明                                                             |
| ----------- | --------------------------- | ------ | ---------------------------------------------------------------- |
| title       | `string`                    | `''`   | 标题                                                             |
| icon        | `string \| { svg: string }` | `''`   | 显示在标题左侧的图标，支持 iconify 所有图标，也可以使用 图片链接 |
| href        | `string`                    | `''`   | 链接                                                             |
| description | `string`                    | `''`   | 详情                                                             |

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 卡片详情内容 |
| title   | 自定义标题   |

## 示例

**输入：**

```md :no-line-numbers
<LinkCard title="卡片标题" href="/" description="这里是卡片内容" />
<LinkCard icon="twemoji:astonished-face" title="卡片标题" href="/" />
```

**输出：**

<LinkCard title="卡片标题" href="/" description="这里是卡片内容" />
<LinkCard icon="twemoji:astonished-face" title="卡片标题" href="/" />

使用组件插槽，可以实现更丰富的表现。

**输入：**

```md :no-line-numbers
<LinkCard title="卡片标题" href="/">

  - 这里是卡片内容
  - 这里是卡片内容

</LinkCard>

<LinkCard href="/">
  <template #title>
    <span style="color: red" >卡片标题</span>
  </template>

  - 这里是卡片内容
  - 这里是卡片内容

</LinkCard>
```

**输出：**
<LinkCard title="卡片标题" href="/">

- 这里是卡片内容
- 这里是卡片内容

</LinkCard>

<LinkCard href="/">
  <template #title>
    <span style="color: red" >卡片标题</span>
  </template>

- 这里是卡片内容
- 这里是卡片内容
</LinkCard>

:::info
在插槽内也可以使用 markdown 语法，但需要注意的是，markdown 语法需要与 标签之间间隔一行。
否则将被识别为普通文本。
:::
