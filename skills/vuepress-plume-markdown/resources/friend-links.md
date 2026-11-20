# Friend links page

```md
---
pageLayout: friends
title: 友情链接
description: 与优秀的人一起成长
contentPosition: after
cols: 3
list:
  - name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: 即使慢，驰而不息
    location: 广州
    organization: VuePress
    socials:
      - icon: github
        link: https://github.com/pengzhanbo
---
```

`friends: true` is deprecated — use `pageLayout: friends`.

| Field | Type | Default |
| --- | --- | --- |
| `title` | `string` | `'My Friends'` |
| `description` | `string` | — |
| `contentPosition` | `'before' \| 'after'` | `'after'` (markdown around the list) |
| `cols` | `number` | `2` (2–3 looks best) |
| `list` | `FriendsItem[]` | `[]` |
| `groups` | `{ title?, desc?, list? }[]` | `[]` (grouped sections) |

`FriendsItem`:

| Field | Type |
| --- | --- |
| `name` / `link` | required |
| `avatar` | `string` |
| `desc` | `string` |
| `location` / `organization` | `string` |
| `socials` | `SocialLink[]` (`{ icon, link, ariaLabel? }`) |
| `backgroundColor` / `color` / `nameColor` | `string \| { light, dark }` |

Grouped example:

```md
---
pageLayout: friends
groups:
  - title: 团队
    desc: 核心成员
    list:
      - { name: A, link: https://a.dev, avatar: /a.png }
  - title: 社区
    list:
      - { name: B, link: https://b.dev }
---
```

Add the page to your `navbar` manually — the layout does not register a route by itself.
