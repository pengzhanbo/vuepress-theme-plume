---
url: /guide/components/image-card/index.md
---
## 概述

使用 `<ImageCard>` 组件在页面中显示图片卡片。

图片卡片 有别于 markdown 的 普通插入图片方式，它展示与图片相关的更多信息，包括标题、描述、作者、链接等。
适用于如 摄影作品、设计作品、宣传海报 等场景。

## Props

:::: field-group

::: field name="image" type="string" required
图片链接地址，本地图片必须使用绝对路径，即以 `/` 开头的路径，指向 `/public` 目录
:::

::: field name="title" type="string" optional
图片标题
:::

::: field name="description" type="string" optional
图片描述信息
:::

::: field name="author" type="string" optional
图片作者
:::

::: field name="href" type="string" optional
点击图片标题后的跳转链接
:::

::: field name="date" type="string | Date | number" optional
图片 创作日期
:::

::: field name="width" type="string | number" optional
图片宽度
:::

::: field name="center" type="boolean" optional
图片宽度不满屏时是否居中
:::

::::

## 示例

**输入：**

```md :no-line-numbers
<ImageCard
  image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
  title="阿尔凡齐纳灯塔，阿尔加维，葡萄牙"
  description="今天照片中的灯塔位于葡萄牙南部海岸阿尔加维的卡沃埃罗。阿尔凡齐纳灯塔建于1919年，照耀着大海，帮助船只在该地区周围危险的水域航行。这座灯塔是著名的旅游胜地，同时也是该地区与海洋紧密联系的象征。如果你有幸住在灯塔附近，那么本周末就是拜访灯塔的最佳时机。"
  href="/"
  author="Andreas Kunz"
  date="2024/08/16"
/>
```

**输出：**

还可以放到 `<CardGrid>` 组件中。

**输入：**

```md :no-line-numbers
<CardGrid>
  <ImageCard
    image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
    title="阿尔凡齐纳灯塔，阿尔加维，葡萄牙"
    description="..."
    href="/"
    author="Andreas Kunz"
    date="2024/08/16"
  />
  <ImageCard
    image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
    title="阿尔凡齐纳灯塔，阿尔加维，葡萄牙"
    description="..."
    href="/"
    author="Andreas Kunz"
    date="2024/08/16"
  />
</CardGrid>
```

**输出：**

[查看 照片类作品示例](../../../../1.示例/照片类作品示例.md)
