# Tabs & Code Tabs

`::: tabs` and `::: code-tabs` are **always available** — no config needed.

## Tabs

```md
::: tabs
@tab 标题 1
内容 1

@tab:active 标题 2
内容 2（默认激活）
:::
```

- `@tab` must start the line; `@tab:active` marks the tab opened by default.
- `@tab 标题 2#值 2` gives that tab a custom value (tracked in `localStorage`).
- `::: tabs#group-id` — tabs sharing the id stay in sync across the page and across reloads.
- Inside a tab, the component scope exposes `value` and `isActive`.

## Code Tabs

````md
::: code-tabs#lang
@tab TS
```ts
const a: number = 1
```

@tab:active JS
```js
const a = 1
```
:::
````

Options for the **container only**:

```ts
markdown: { codeTabs: { icon: true } } // default; `false` hides language icons
```

`markdown.tabs` does **not** exist — the tabs container has no options.

## Nesting

Nest a single-colon container inside code tabs by giving the outer one more colons:

````md
:::: code-tabs
@tab Demo
::: tip
提示
:::
::::
````

## Notes

- No blank line between `@tab` and the first line of the tab body.
- Code tabs must contain only fenced code blocks (one per tab) for the language icon to show.
- Same `#id` synchronises the active tab between separate container blocks.
