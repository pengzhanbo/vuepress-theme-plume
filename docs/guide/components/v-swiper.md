---
title: 轮播图
icon: dashicons:images-alt2
createTime: 2024/09/12 22:00:22
permalink: /guide/components/swiper/
---

## 概述

使用 `<Swiper>` 组件在页面中显示轮播图片。

## 使用

使用该组件，需要手动安装 `swiper` 库：

::: npm-to

```sh
npm install swiper
```

:::

组件可在任意 markdown 文件中直接使用（主题会自动按需导入 `Swiper` 组件）。

```md
<Swiper :items="['img_link1', 'img_link2']" />
```

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const images = ref([])

async function fetchImage() {
  const res = await fetch('https://api.pengzhanbo.cn/wallpaper/bing/zh').then((res) => res.json())
  images.value = res.map(item => ({
    name: item.title,
    link: item.url,
  }))
}

if (!__VUEPRESS_SSR__) {
  fetchImage()
}
</script>

**示例:**

<Swiper v-if="images.length" :items="images" />

## Props

:::: field-group
::: field items
@type `string | { link: string, href?: string, alt?: string }[]`
@default `[]`
图片链接数组。传入对象时，`link` 表示图片链接，`href` 表示跳转链接，`alt` 表示图片描述
:::
::: field width
@type `number | string`
@default `100%`
轮播区域宽度
:::
::: field height
@type `number | string`
@default `100%`
轮播区域高度
:::
::: field mode
@type `'banner' | 'carousel' | 'broadcast'`
@default `'banner'`
@enum 'banner'|'carousel'|'broadcast'
轮播模式：`banner` 轮播图、`carousel` 走马灯、`broadcast` 信息展播
:::
::: field navigation
@type `boolean`
@default `true`
是否显示导航按钮
:::
::: field effect
@type `'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'`
@default `'slide'`
轮播效果
:::
::: field delay
@type `number`
@default `3000`
@unit ms
轮播间隔时间，仅当 `mode: 'banner'` 时生效
:::
::: field speed
@type `number`
@default `300`
@unit ms
动画持续时间
:::
::: field loop
@type `boolean`
@default `true`
是否循环
:::
::: field pauseOnMouseEnter
@type `boolean`
@default `false`
是否鼠标悬停时暂停轮播
:::
::: field swipe
@type `boolean`
@default `true`
是否开启手势滑动
:::
::::

更多 props 请参考 [Swiper 文档](https://swiperjs.com/swiper-api#parameters)

## Slots

**该组件不提供具名插槽。** 轮播项通过 `items` 属性传入，每个项可以是图片地址，或包含 `link`、`href`、`alt` 的对象：

```vue
<Swiper :items="[
  '/images/slide-1.png',
  { link: '/images/slide-2.png', href: 'https://example.com', alt: '点击跳转' },
]"
/>
```

::: tip
每项的 `link` 是**图片地址**，`href` 才是**点击跳转的目标** —— 两者含义不同，容易混淆。
:::

## 示例

::: warning 下方示例中的 images 来自本页的 script setup

本页所有参考示例都写成了 `:items="images"`，其中的 `images` 定义在本页顶部的 `<script setup>` 中
（用于从示例站点拉取壁纸数据），**并非组件的内置变量**。

直接复制这些示例到你的页面时，需要自行提供等价的数据：

```vue
<script setup lang="ts">
const images = [
  { link: '/images/slide-1.png' },
  { link: '/images/slide-2.png' },
]
</script>
```

:::

### 预设动画效果

**cube:**

<Swiper v-if="images.length" :items="images" effect="cube" />

:::details 查看代码

```md
<Swiper :items="images" effect="cube" />
```

:::

**fade:**

<Swiper v-if="images.length" :items="images" effect="fade" />

:::details 查看代码

```md
<Swiper :items="images" effect="fade" />
```

:::

**coverflow:**

<Swiper v-if="images.length" :items="images" effect="coverflow" />

:::details 查看代码

```md
<Swiper :items="images" effect="coverflow" />
```

:::

**flip:**

<Swiper v-if="images.length" :items="images" effect="flip" />

:::details 查看代码

```md
<Swiper :items="images" effect="flip" />
```

:::

**cards:**

<Swiper v-if="images.length" :items="images" effect="cards" />

:::details 查看代码

```md
<Swiper :items="images" effect="cards" />
```

:::

### 自定义动画效果

**示例 1：**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: [0, 0, -400] },
  next: { translate: ['100%', 0, 0] },
}" />

::: details 查看代码

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: [0, 0, -400] },
  next: { translate: ['100%', 0, 0] },
}"
/>
```

:::

**示例 2：**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true,  translate: [0, 0, -800], rotate: [180, 0, 0] },
  next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
}" />

:::details 查看代码

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true,  translate: [0, 0, -800], rotate: [180, 0, 0] },
  next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
}"
/>
```

:::

**示例 3：**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
  next: { shadow: true, translate: ['125%', 0, -800], rotate: [0, 0, 90] },
}" />

:::details 查看代码

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
  next: { shadow: true, translate: ['125%', 0, -800], rotate: [0, 0, 90] },
}"
/>
```

:::

**示例 4：**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
  next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
}" />

:::details 查看代码

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
  next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
}"
/>
```

:::

### 走马灯

<Swiper
  v-if="images.length"
  :items="images"
  mode="carousel"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  :speed="5500"
/>

:::details 查看代码

```md
<Swiper
  :items="images"
  mode="carousel"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  :speed="5500"
/>
```

:::

### 信息展播

<Swiper
  v-if="images.length"
  :items="images"
  mode="broadcast"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  mousewheel
/>

:::details 查看代码

```md
<Swiper
  :items="images"
  mode="broadcast"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  mousewheel
/>
```

:::
