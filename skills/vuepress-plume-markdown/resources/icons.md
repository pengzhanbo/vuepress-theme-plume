# Icons

Enabled by default. Syntax is **two colons on each side**.

```md
::mdi:home::
::mdi:home =24::
::mdi:home =24x16::
::mdi:home =x16::
::mdi:home =1.2em::
::mdi:home =1.2emx1.5em::
::mdi:home /#ff0000::
::mdi:home =24 /#ff0000::
```

| Part | Meaning |
| --- | --- |
| `collection:name` | iconify icon (`mdi:home`); with `prefix` configured, `::home::` works too |
| `=size` | `24` (px), `24x16`, `x16` (height only), `1.2em`, `1.2emx1.5em` |
| `/color` | any CSS color |

## Config

```ts
markdown: {
  icon: {
    provider: 'iconify', // default
    prefix: 'mdi',       // lets you write ::home::
  },
}
```

Other providers (need extra assets):

```ts
markdown: { icon: { provider: 'iconfont', prefix: 'icon', assets: '/iconfont/iconfont.css' } }
markdown: { icon: { provider: 'fontawesome', assets: 'fontawesome' } } // default prefix `fas`
```

- With a non-iconify provider you can still force iconify: `::iconify carbon:home::`.
- FontAwesome extra classes append after a space: `::circle-user 2xl beat::`.
- `markdown.icons` is deprecated — always use `markdown.icon`.
- Inside tables/lists the syntax works inline; escape as `\::name::` when you need the literal text.

## Related

`<Icon name="..." size="1.2em" color="..." />` component — see `resources/components.md`.
