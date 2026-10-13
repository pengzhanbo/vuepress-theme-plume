---
title: Swiper
icon: dashicons:images-alt2
createTime: 2025/10/08 22:00:22
permalink: /en/guide/components/swiper/
---

## Overview

Use the `<Swiper>` component to display image carousels on pages.

## Usage

To use this component, first manually install the `swiper` library:

::: npm-to

```sh
npm install swiper
```

:::

The component can be used directly in any markdown file (the theme will automatically import the `Swiper` component on demand).

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

**Example:**

<Swiper v-if="images.length" :items="images" />

## Props

:::: field-group
::: field items
@type `string | { link: string, href?: string, alt?: string }[]`
@default `[]`
Image link array. When passing objects, `link` represents the image URL, `href` the navigation link, and `alt` the image description
:::
::: field width
@type `number | string`
@default `100%`
Carousel area width
:::
::: field height
@type `number | string`
@default `100%`
Carousel area height
:::
::: field mode
@type `'banner' | 'carousel' | 'broadcast'`
@default `'banner'`
@enum 'banner'|'carousel'|'broadcast'
Carousel mode: `banner` banner, `carousel` carousel, `broadcast` information display
:::
::: field navigation
@type `boolean`
@default `true`
Whether to show navigation buttons
:::
::: field effect
@type `'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'`
@default `'slide'`
Carousel effect
:::
::: field delay
@type `number`
@default `3000`
@unit ms
Carousel interval. Only effective when `mode: 'banner'`
:::
::: field speed
@type `number`
@default `300`
@unit ms
Animation duration
:::
::: field loop
@type `boolean`
@default `true`
Whether to loop
:::
::: field pauseOnMouseEnter
@type `boolean`
@default `false`
Whether to pause the carousel on mouse hover
:::
::: field swipe
@type `boolean`
@default `true`
Whether to enable gesture swiping
:::
::::

For more props, refer to [Swiper Documentation](https://swiperjs.com/swiper-api#parameters)

## Slots

**This component provides no named slots.** Slides are passed through the `items` prop. Each item is
either an image URL or an object with `link`, `href` and `alt`:

```vue
<Swiper :items="[
  '/images/slide-1.png',
  { link: '/images/slide-2.png', href: 'https://example.com', alt: 'Click to visit' },
]"
/>
```

::: tip
`link` is the **image address**, while `href` is the **click target**. The two mean different things
and are easy to confuse.
:::

## Examples

::: warning The `images` in the examples below come from this page's script setup

All reference examples on this page use `:items="images"`, where `images` is defined in the
`<script setup>` at the top of this page (used to fetch wallpaper data from the example site) —
**it is not a built-in variable of the component**.

When copying these examples directly into your own page, you need to provide equivalent data yourself:

```vue
<script setup lang="ts">
const images = [
  { link: '/images/slide-1.png' },
  { link: '/images/slide-2.png' },
]
</script>
```

:::

### Preset Animation Effects

**cube:**

<Swiper v-if="images.length" :items="images" effect="cube" />

:::details View Code

```md
<Swiper :items="images" effect="cube" />
```

:::

**fade:**

<Swiper v-if="images.length" :items="images" effect="fade" />

:::details View Code

```md
<Swiper :items="images" effect="fade" />
```

:::

**coverflow:**

<Swiper v-if="images.length" :items="images" effect="coverflow" />

:::details View Code

```md
<Swiper :items="images" effect="coverflow" />
```

:::

**flip:**

<Swiper v-if="images.length" :items="images" effect="flip" />

:::details View Code

```md
<Swiper :items="images" effect="flip" />
```

:::

**cards:**

<Swiper v-if="images.length" :items="images" effect="cards" />

:::details View Code

```md
<Swiper :items="images" effect="cards" />
```

:::

### Custom Animation Effects

**Example 1:**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: [0, 0, -400] },
  next: { translate: ['100%', 0, 0] },
}" />

::: details View Code

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: [0, 0, -400] },
  next: { translate: ['100%', 0, 0] },
}"
/>
```

:::

**Example 2:**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true,  translate: [0, 0, -800], rotate: [180, 0, 0] },
  next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
}" />

:::details View Code

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true,  translate: [0, 0, -800], rotate: [180, 0, 0] },
  next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
}"
/>
```

:::

**Example 3:**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
  next: { shadow: true, translate: ['125%', 0, -800], rotate: [0, 0, 90] },
}" />

:::details View Code

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
  next: { shadow: true, translate: ['125%', 0, -800], rotate: [0, 0, 90] },
}"
/>
```

:::

**Example 4:**

<Swiper v-if="images.length" :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
  next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
}" />

:::details View Code

```md
<Swiper :items="images" effect="creative" :creativeEffect="{
  prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
  next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
}"
/>
```

:::

### Carousel

<Swiper
  v-if="images.length"
  :items="images"
  mode="carousel"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  :speed="5500"
/>

:::details View Code

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

### Information Display

<Swiper
  v-if="images.length"
  :items="images"
  mode="broadcast"
  :height="200"
  :slides-per-view="3"
  :space-between="20"
  mousewheel
/>

:::details View Code

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
