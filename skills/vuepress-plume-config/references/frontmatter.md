# Frontmatter Reference

Page config lives in YAML frontmatter. Theme auto-fills `title`, `createTime` and `permalink` when
`autoFrontmatter` is on — do not fabricate permalinks unless the user asks for a specific one.

## Common (`ThemeNormalFrontmatter`)

| Key | Type | Default |
| --- | --- | --- |
| `pageLayout` | `false \| 'home' \| 'posts' \| 'doc' \| 'custom' \| 'page' \| 'friends' \| '<GlobalComponent>'` | `'doc'` |
| `pageClass` | `string` | `''` |
| `title` | `string` | `''` |
| `badge` | `string \| ThemeBadge` | — |
| `icon` | `ThemeIcon` | — (used by navbar/sidebar) |
| `createTime` | `string \| false` | auto |
| `permalink` | `string` | auto |
| `draft` | `boolean` | `false` |
| `feed` | `boolean \| { title?, description?, summary?, guid? }` | `true` |
| `linkPreview` | `boolean` | `true` |
| `externalLinkIcon` | `boolean` | `true` |
| `backToTop` | `boolean` | `true` |
| `reader` | `boolean` | `true` |
| `comments` | `boolean` | `true` (needs `comment` enabled) |
| `sidebar` | `string \| false` | — |
| `aside` | `boolean \| 'left'` | `true` |
| `navbar` | `boolean` | `true` |
| `outline` | `false \| number \| [number, number] \| 'deep'` | `[2, 3]` |
| `prev` / `next` | `string \| { text, link, icon? }` | auto |
| `series` / `seriesOrder` / `seriesNav` | `string` / `number` / `boolean` | — / — / `true` |
| `readingTime` | `boolean` | `true` |
| `lastUpdated` | `boolean` | `true` |
| `contributors` | `boolean \| string[]` | `true` |
| `changelog` | `boolean` | `false` |
| `copyright` | `boolean \| CopyrightLicense \| CopyrightFrontmatter` | `false` |
| `editLink` / `editLinkPattern` | `boolean` / `string` | `true` / theme value |
| `watermark` | `boolean \| WatermarkOptions` | theme value |
| `footer` | `boolean` | `true` |
| `password` / `passwordHint` | `string` | — |

`pageLayout` notes: `'custom'` (≡ `false`) renders markdown only, `'page'` adds navbar, `'friends'` is the
friend-links layout, `'home'` the home layout. Any other string is resolved as a global component name.
`'blog'` is deprecated → `'posts'`.

`outline` can be overridden per heading with `{data-outline="5"}` (or `{outline="5"}`) after a heading.

## Post pages (`ThemePostFrontmatter`)

| Key | Type | Default |
| --- | --- | --- |
| `sticky` | `boolean \| number` | `false` (`true` beats any number; `0`/negative = off) |
| `article` | `boolean` | `true` (show in list) |
| `tags` | `string[]` | `[]` |
| `cover` | `string` | `''` (absolute or remote URL only) |
| `coverStyle` | `PostsCoverStyle` | `{ ratio: '4:3', width: 240, compact: false }` |
| `excerpt` | `boolean \| string` | `undefined` (string disables `<!-- more -->`) |
| `relatedPosts` | `false \| string[]` | build-time result |

Sticky articles only float on page 1 of the list.

## Home (`README.md` only)

```yaml
---
pageLayout: home
config:
  - type: banner
    banner: /images/banner.jpg
    bannerMask: { light: 0.1, dark: 0.3 }
    hero:
      name: Site Name
      tagline: Tagline
      text: Description
      actions: [{ text: Start, link: /guide/, theme: brand }]
  - type: hero
    full: true
    effect: prism
    hero:
      name: Theme Plume
      text: ...
      actions: [{ text: Docs, link: /guide/, theme: brand, icon: mdi:book }]
  - type: features
    features: [{ title: Fast, icon: mdi:speedometer, details: ... }]
  - type: image-text
    title: ...
    image: /images/x.svg
    list: [{ title: ..., description: ... }]
  - type: text-image
    title: ...
    image: /images/y.svg
    list: [...]
  - type: custom
---
```

- `type`: `banner | hero | doc-hero | text-image | image-text | features | profile | posts | custom | <Component>`.
- Section base fields: `full`, `backgroundImage` (`string | { light, dark }`), `backgroundAttachment`
  (`'fixed' | 'local'`). `index` and `onlyOnce` are injected at build time — do not hand-write them.
- `hero.effect`: `'tint-plate' | 'prism' | 'pixel-blast' | 'hyper-speed' | 'liquid-ether' | 'dot-grid' |
  'iridescence' | 'orb' | 'beams' | 'lightning'`, plus `effectConfig` and `filter`. A URL in `effect` = background image.
- `signDown: true` shows the scroll-down arrow. `home: true` is deprecated → `pageLayout: home`.

## Friend links

```yaml
---
pageLayout: friends
title: 友情链接
description: ...
contentPosition: after # 'before' | 'after'
cols: 2
list:
  - name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: ...
    location: 广州
    organization: VuePress
    socials: [{ icon: github, link: https://github.com/pengzhanbo }]
groups:
  - title: 分组
    desc: ...
    list: []
---
```

Item colors: `backgroundColor`, `color`, `nameColor` (`string | { light, dark }`). `friends: true` is deprecated.
