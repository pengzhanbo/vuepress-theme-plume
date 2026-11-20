# Plot (hidden text)

Hide text until the reader hovers/clicks — useful for spoilers or exercise answers.

Enabled by default (`markdown.plot: true`).

```md
!!需要隐秘的内容!!
!!需要隐秘的内容!!{.blur}
!!需要隐秘的内容!!{.blur .click}
```

| Inline modifier | Effect |
| --- | --- |
| `.hover` / `.click` | reveal trigger |
| `.mask` / `.blur` | reveal effect |

## Global defaults

```ts
markdown: {
  plot: {
    trigger: 'hover', // | 'click'
    effect: 'mask',   // | 'blur'
  },
}
```

`false` disables the syntax for the whole site.

## Per-page defaults

```md
---
plot:
  trigger: click
  effect: blur
---
```

## Component

`<VPPlot trigger="click" effect="blur">内容</VPPlot>` — see `resources/components.md`.
