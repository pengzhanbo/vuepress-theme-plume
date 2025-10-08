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

Then, manually import the `Swiper` component:

```md
<!-- Import in markdown -->
<script setup>
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
</script>

<!-- After importing, you can use it in markdown -->
<Swiper :items="['img_link1', 'img_link2']" />
```

Register as a global component:

```ts title=".vuepress/client.ts"
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Swiper', Swiper)
  },
})
```

Global components can be used in any other markdown file:

```md
<Swiper :items="['img_link1', 'img_link2']" />
```

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

const images = ref([])

async function fetchImage() {
  const res = await fetch('https://api.pengzhanbo.cn/wallpaper/bing/zh/').then((res) => res.json())
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

| Name              | Type                                                       | Default    | Description                                                                         |
| ----------------- | ---------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| items             | `string \| { link: string; href?: string; alt?: string}[]` | `[]`       | Image link array. When passing objects, `link` represents image URL, `href` represents navigation link, `alt` represents image description |
| width             | `number \| string`                                         | `100%`     | Carousel area width                                                                 |
| height            | `number \| string`                                         | `100%`     | Carousel area height                                                                |
| mode              | `'banner' \| 'carousel' \| 'broadcast'`                    | `'banner'` | Carousel mode: `banner`: banner; `carousel`: carousel; `broadcast`: information display |
| navigation        | `boolean`                                                  | `true`     | Whether to show navigation buttons                                                  |
| effect            | `'slide' \| 'fade' \| 'cube' \| 'coverflow' \| 'flip' \| 'cards' \| 'creative'` | `'slide'`  | Carousel effect                                                                     |
| delay             | `number`                                                   | `3000`     | Carousel interval time. Only effective when `mode: 'banner'`. Unit: `ms`            |
| speed             | `number`                                                   | `300`      | Animation duration. Unit: `ms`                                                      |
| loop              | `boolean`                                                  | `true`     | Whether to loop                                                                     |
| pauseOnMouseEnter | `boolean`                                                  | `false`    | Whether to pause carousel on mouse hover                                            |
| swipe             | `boolean`                                                  | `true`     | Whether to enable gesture swiping                                                   |

For more props, refer to [Swiper Documentation](https://swiperjs.com/swiper-api#parameters)

## Reference Examples

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
