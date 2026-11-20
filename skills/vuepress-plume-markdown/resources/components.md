# Vue Components

All components below are **globally registered** and usable in markdown without imports (auto-import via
`unplugin-vue-components`), except `HomeBox`, which must be imported in a Vue SFC. In Vue code the names are
`VPCard`, `VPBadge`, `VPIcon`, `VPPlot`, `VPSwiper`, `VPHomeBox`, …

Markdown and props can be mixed: leave a blank line between the tag and inner markdown.

## Layout & cards

### `<Card>`

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | `''` |
| `icon` | `string \| { svg: string }` | `''` |

Slots: `default`, `title`. Container equivalent: `resources/card.md`.

```md
<Card title="卡片标题" icon="twemoji:astonished-face">
  这里是卡片内容。
</Card>
```

### `<CardGrid>`

| Prop | Type | Default |
| --- | --- | --- |
| `cols` | `string \| number \| { sm?, md?, lg? }` | `{ sm: 1, md: 2, lg: 2 }` |

Breakpoints: `sm < 768px`, `md 768–959px`, `lg ≥ 960px`. Container: `:::: card-grid`.

```md
<CardGrid :cols="{ sm: 1, md: 2, lg: 3 }">
  <Card title="一" />
  <Card title="二" />
</CardGrid>
```

### `<CardMasonry>`

| Prop | Type | Default |
| --- | --- | --- |
| `cols` | `number \| { sm?, md?, lg? }` | `{ sm: 2, md: 2, lg: 3 }` |
| `gap` | `number` | `16` |

Breakpoints: `sm < 640`, `md 640–959`, `lg ≥ 960`. Client-only rendering; items are laid out by height, so
reading order ≠ source order. Container: `::: card-masonry cols="3" gap="16"`.

```md
:::: card-masonry

![a](/images/1.png)

![b](/images/2.png)

::::
```

### `<ImageCard>`

| Prop | Type | Default |
| --- | --- | --- |
| `image` | `string` | required (local images must start with `/`) |
| `title` / `description` / `author` / `href` | `string` | — |
| `date` | `string \| Date \| number` | — |
| `width` | `string \| number` | — |
| `center` | `boolean` | — |

```md
<ImageCard image="/images/a.webp" title="灯塔" author="Andreas Kunz" date="2024/08/16" href="/" />
```

### `<LinkCard>`

| Prop | Type | Default |
| --- | --- | --- |
| `href` | `string` | required |
| `title` / `description` | `string` | — |
| `icon` | `string \| { svg: string }` | — |
| `target` / `rel` | `string` | — |

```md
<LinkCard title="主题文档" href="/guide/" description="快速开始使用 Plume" />
```

### `<RepoCard>`

| Prop | Type | Default |
| --- | --- | --- |
| `repo` | `string` (`owner/repo`) | required |
| `provider` | `'github' \| 'gitee'` | `'github'` |
| `fullname` | `boolean` | auto (org shows `owner/repo`) |

Data is fetched from the API at runtime.

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

## Badges & icons

### `<Badge>`

| Prop | Type | Default |
| --- | --- | --- |
| `type` | `'info' \| 'tip' \| 'warning' \| 'danger' \| string` | `'tip'` |
| `text` | `string` | `''` |
| `color` / `bgColor` | `string` | — |
| `borderColor` | `string` | `'transparent'` |

`default` slot wins over `text`.

```md
- VuePress - <Badge type="info" text="v2" />
- <Badge text="v2" color="#8e5cd9" bg-color="rgba(159, 122, 234, 0.16)" />
```

### `<NpmBadge>` / `<NpmBadgeGroup>`

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | `''` (falls back to `repo`) |
| `repo` | `string` | required when `name` is empty |
| `type` | `NpmBadgeType` | required (`NpmBadge` only) |
| `items` | `string \| NpmBadgeType \| NpmBadgeType[]` | `[]` (`NpmBadgeGroup`, `,` separated) |
| `theme` | `NpmBadgeTheme` | `'flat'` (`social` for stars/forks) |
| `label` | `string` | per type |
| `color` / `labelColor` | `string` | `'#32A9C3'` / `'#1B3C4A'` |
| `branch` / `dir` | `string` | `'main'` / `''` (monorepo) |

`NpmBadgeType`: `source | stars | forks | license | version | dt | d18m | dw | dm | dy`.
`NpmBadgeTheme`: `flat | flat-square | plastic | for-the-badge | social`.

```md
<NpmBadge name="vuepress-theme-plume" type="dm" />
<NpmBadgeGroup name="vuepress-theme-plume" items="version,dm" />
```

### `<Icon>`

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string \| { svg: string }` | required |
| `provider` | `'iconify' \| 'iconfont' \| 'fontawesome'` | `markdown.icon.provider` |
| `color` | `string` | `currentColor` |
| `size` | `string \| number` | `1em` (number = px, `'20x20'` allowed) |
| `extra` | `string` | — (extra FontAwesome classes) |

```md
<Icon name="material-symbols:home" size="1.2em" />
```

## Media

### `<Swiper>`

Requires `swiper` installed. Props: `items` (`string | { link, href?, alt? }[]`), `width` / `height`
(`100%`), `mode` (`'banner' | 'carousel' | 'broadcast'`, default `'banner'`), `navigation` (`true`), `effect`
(`'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'`), `delay` (`3000`), `speed` (`300`),
`loop` (`true`), `pauseOnMouseEnter` (`false`), `swipe` (`true`). Other Swiper props pass through.

```md
<Swiper :items="['/images/1.png', { link: '/images/2.png', href: 'https://example.com', alt: '跳转' }]" />
```

### `<VPPlot>`

`trigger` (`'hover' | 'click'`, default `'hover'`), `effect` (`'mask' | 'blur'`, default `'mask'`).

```md
<VPPlot trigger="click">点击后可见</VPPlot>
```

## `<HomeBox>`

```vue
import { VPHomeBox } from 'vuepress-theme-plume/client'
```

| Prop | Type |
| --- | --- |
| `type` | `'banner' \| 'hero' \| 'doc-hero' \| 'text-image' \| 'image-text' \| 'features' \| 'profile' \| 'custom' \| 'posts'` |
| `index` | `number` |
| `full` | `boolean` |
| `backgroundImage` | `string \| { light, dark? }` |
| `backgroundAttachment` | `'fixed' \| 'local'` |
| `containerClass` | `string \| string[] \| Record<string, boolean>` |
| `onlyOnce` | `boolean` |

Slots: `before` (full width, outside the container), `default` (inside `.container`, max 1152px), `after`.

```md
<HomeBox type="custom" :index="0" :full="true">
  <div>任意内容</div>
</HomeBox>
```
