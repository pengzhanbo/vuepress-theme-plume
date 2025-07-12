---
url: /guide/components/swiper/index.md
---
## 概述

使用 `<Swiper>` 组件在 页面中显示轮播图片。

## 使用

使用该组件，首先需要手动安装 `swiper` 库：

::: npm-to

```sh
npm install swiper
```

:::

然后，手动导入 `Swiper` 组件：

```md
<!-- 在 markdown 中导入 -->
<script setup>
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
</script>

<!-- 导入后，即可在 markdown 中使用 -->
<Swiper :items="['img_link1', 'img_link2']" />
```

注册为全局组件：

```ts title=".vuepress/client.ts"
import Swiper from 'vuepress-theme-plume/features/Swiper.vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Swiper', Swiper)
  },
})
```

全局组件可在 其他任意 markdown 文件中使用

```md
<Swiper :items="['img_link1', 'img_link2']" />
```

**示例:**

## Props

| 名称              | 类型                                                       | 默认值     | 说明                                                                                |
| ----------------- | ---------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| items             | `string \| { link: string; href?: string; alt?: string}[]` | `[]`       | 图片链接数组，传入对象时，`link`表示图片链接，`href`表示跳转链接，`alt`表示图片描述 |
| width             | `number \| string`                                         | `100%`     | 轮播区域宽度                                                                        |
| height            | `number \| string`                                         | `100%`     | 轮播区域高度                                                                        |
| mode              | `'banner' \| 'carousel' \| 'broadcast'`                    | `'banner'` | 轮播模式, `banner`: 轮播图; `carousel`: 走马灯; `broadcast`: 信息展播               |
| navigation        | `boolean`                                                  | `true`     | 是否显示导航按钮                                                                    |
| effect            | `'slide' \| 'fade' \| 'cube' \| 'coverflow' \| 'flip' \| 'cards' \| 'creative'` | `'slide'`  | 轮播效果                                                                            |
| delay             | `number`                                                   | `3000`     | 轮播间隔时间, 仅当 `mode: 'banner'` 时生效，单位 `ms`                               |
| speed             | `number`                                                   | `300`      | 动画持续时间，单位 `ms`                                                             |
| loop              | `boolean`                                                  | `true`     | 是否循环                                                                            |
| pauseOnMouseEnter | `boolean`                                                  | `false`    | 是否鼠标悬停时暂停轮播                                                              |
| swipe             | `boolean`                                                  | `true`     | 是否开启手势滑动                                                                    |

更多 props 请参考 [Swiper 文档](https://swiperjs.com/swiper-api#parameters)

## 参考示例

### 预设动画效果

**cube:**

:::details 查看代码

```md
<Swiper :items="images" effect="cube" />
```

:::

**fade:**

:::details 查看代码

```md
<Swiper :items="images" effect="fade" />
```

:::

**coverflow:**

:::details 查看代码

```md
<Swiper :items="images" effect="coverflow" />
```

:::

**flip:**

:::details 查看代码

```md
<Swiper :items="images" effect="flip" />
```

:::

**cards:**

:::details 查看代码

```md
<Swiper :items="images" effect="cards" />
```

:::

### 自定义动画效果

**示例 1：**

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
