---
title: Home Layout Container
icon: tabler:container
createTime: 2025/10/08 23:49:40
permalink: /en/guide/components/home-box/
---

## Overview

`<HomeBox>` is the wrapper container for every **area** of a custom homepage. It handles the background
image, padding and full-height layout.

All built-in homepage area types (`banner`, `hero`, `features`, etc.) use it internally. You will use it
directly when writing a [custom area type](../custom/home.md#custom-section-types).

```md
<HomeBox :background-image="bg" :full="true">
  <div>Arbitrary content</div>
</HomeBox>
```

## Props

:::: field-group

::: field type
@type `'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom' | 'posts'`
@required
Area type. Passed by the theme when rendering the area; you rarely need to set it manually.
:::

::: field index
@type `number`
@required
The area's position on the homepage, computed by the theme from the `config` array order.
:::

::: field full
@type `boolean`
@default `false`
Whether the area fills the viewport height (`100vh` minus the navbar height). Common for the
first-screen `hero` and `banner`.
:::

::: field backgroundImage
@type `string | { light: string, dark?: string }`

Background image. Pass an object to specify different images for light and dark modes.
:::

::: field backgroundAttachment
@type `'fixed' | 'local'`

Background positioning. `fixed` pins the background to the viewport so it does not scroll.
:::

::: field containerClass
@type `string | string[] | Record<string, boolean>`

Extra class names applied to the inner `.container`, for customising content width and spacing.
:::

::: field onlyOnce
@type `boolean`

Whether the area is rendered only once. Used internally by the theme; rarely set manually.
:::

::::

## Slots

The component provides 3 slots. `before` and `after` sit **outside** the content container (not
constrained by `max-width`), which makes them suitable for full-width decoration.

| Slot | Position | Use |
| --- | --- | --- |
| `before` | Before the container, above the background image | Full-width decoration, e.g. a top banner or divider |
| `default` | Inside `.container` | Main content, constrained to 1152px and centred |
| `after` | After the container | Full-width decoration, e.g. a bottom banner |

### `default`

The most commonly used slot. This is the content area that `backgroundImage` and `full` actually apply to.

```vue
<HomeBox :background-image="bg">
  <div class="my-hero">
    <h1>Title</h1>
    <p>Description</p>
  </div>
</HomeBox>
```

### `before`

Sits **outside** `.container`, without the max-width constraint. Ideal for decorations that must
span the full width.

```vue
<HomeBox>
  <template #before>
    <div class="top-banner">Full-width banner</div>
  </template>

  <div>Regular content</div>
</HomeBox>
```

### `after`

Sits **after** `.container`, also unconstrained by width.

```vue
<HomeBox :full="true">
  <div>First-screen content</div>

  <template #after>
    <div class="bottom-banner">Bottom full-width content</div>
  </template>
</HomeBox>
```

## How this relates to homepage area config

When you configure an area in the `README.md` frontmatter, `type` is passed to the component
automatically:

```md title="README.md" frontmatter
---
home: true
config:
  -
    type: hero
    full: true
    backgroundImage:
      light: /images/hero-light.jpg
      dark: /images/hero-dark.jpg
---
```

The corresponding frontmatter fields are passed as props. See [Custom Homepage](../custom/home.md)
for the full area configuration.

## Usage in a custom area type

Wrap your content in `<HomeBox>` when writing a custom area component, and you get background image
and full-screen support for free:

```vue title="your-component.vue"
<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

const props = defineProps<ThemeHomeConfigBase>()
</script>

<template>
  <VPHomeBox
    :type="type"
    :index="index"
    :full="full"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
  >
    <template #before>
      <slot name="before" />
    </template>

    <slot />

    <template #after>
      <slot name="after" />
    </template>
  </VPHomeBox>
</template>
```

::: tip
`VPHomeBox` and `HomeBox` are two names for the same component. Use `HomeBox` directly in Markdown,
and import `VPHomeBox` inside Vue components.
:::

## Related

- [Custom Homepage](../custom/home.md) — area config and custom area types
- [Homepage Hero Effect](../custom/home-hero-effect.md) — animated backgrounds for the hero area
- [Custom Styles](../custom/style.md) — the custom styles `containerClass` relies on
