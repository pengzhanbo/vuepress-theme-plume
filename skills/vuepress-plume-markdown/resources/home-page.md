# Home page

Declared in `{sourceDir}/README.md`. The page is a vertical stack of sections defined in `config`, rendered in
array order.

```md
---
pageLayout: home
config:
  - type: hero
    full: true
    hero:
      name: Theme Plume
      text: VuePress Next Theme
      tagline: 一个简约易用的、功能丰富的 VuePress 文档 & 博客主题
      actions:
        - theme: brand
          text: 快速开始
          link: /guide/intro/
          icon: material-symbols:rocket-launch
        - theme: alt
          text: GitHub
          link: https://github.com/pengzhanbo/vuepress-theme-plume
          suffixIcon: simple-icons:github
          target: _blank
    effect: prism
---
```

`home: true` is deprecated — use `pageLayout: home`. `signDown: true` adds the scroll-down arrow.

## Section base

| Field | Type | Meaning |
| --- | --- | --- |
| `type` | `banner \| hero \| doc-hero \| features \| text-image \| image-text \| profile \| posts \| custom \| <ComponentName>` | section component |
| `full` | `boolean` | 100vh minus navbar |
| `backgroundImage` | `string \| { light, dark }` | section background |
| `backgroundAttachment` | `'fixed' \| 'local'` | background position mode |

`index` and `onlyOnce` are injected at build time — never hand-write them.

## Section types

**`banner`** — big image first screen.

```yaml
- type: banner
  banner: /images/banner.jpg
  bannerMask: { light: 0.1, dark: 0.3 } # 0 = no mask
  hero: { name: ..., tagline: ..., text: ..., actions: [...] }
```

**`hero`** — docs style hero with an animated background.

```yaml
- type: hero
  hero: { name, tagline, text, actions }
  effect: prism        # tint-plate | prism | pixel-blast | hyper-speed | liquid-ether
                       # dot-grid | iridescence | orb | beams | lightning | <image url>
  effectConfig: {}     # depends on the effect
  filter: blur(0)      # only for image backgrounds
```

`actions[]`: `{ theme: 'brand' | 'alt' | 'sponsor', text, link, icon?, suffixIcon?, target?, rel? }`.
Some effects need optional peers (`three`, `ogl`, `gsap`, `postprocessing`).

**`doc-hero`** — hero with a product image: `hero.image` accepts `string | { src, alt } | { light, dark, alt }`.

**`features`**

```yaml
- type: features
  title: 特性
  description: ...
  features:
    - title: 响应式布局
      icon: 💻              # emoji / iconify name / image / { light, dark }
      details: 适配移动设备、PC、平板
      link: /guide/
      linkText: 了解更多
```

**`text-image` / `image-text`** — image on one side, list on the other.

```yaml
- type: image-text
  title: 功能
  description: 内置丰富的功能
  image: /images/plume.svg   # string | { src, alt } | { light, dark, alt }
  width: 400                 # image width
  list:
    - title: 文章信息
      description: ...
    - 纯文本项
```

**`profile`**

```yaml
- type: profile
  name: pengzhanbo
  description: ...
  avatar: /images/avatar.png
  circle: true
```

**`posts`** — embed a post collection list page into the home page:
`{ type: posts, collection: blog }` (`collection` = the collection's `dir`; defaults to the first post collection).

**`custom`** — renders whatever markdown you write below the frontmatter inside that section. Combine it with
`<HomeBox>` / cards for fully custom layouts:

````md
---
pageLayout: home
config:
  - type: custom
---

## 快速开始

:::: card-grid
::: card title="安装" icon="mdi:download"
```sh
pnpm add -D vuepress@next vuepress-theme-plume
```
:::
::::
````

## Colors

```css
:root {
  --vp-bg-home-hero-name: linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 100%);
  --vp-c-home-hero-tagline: var(--vp-c-text-2);
  --vp-c-home-hero-text: var(--vp-c-text-3);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, var(--vp-c-brand-soft) 50%, var(--vp-c-brand-2) 50%);
  --vp-home-hero-image-filter: blur(44px);
}
```
