# Mark (highlight text)

`==text==` renders a marker-pen highlight. Enabled by default.

```md
这是一个 ==高亮文本== 示例。
这在中文文本里 ==需要空格== 才能正确渲染。
```

- Add a space (or start/end of line) around the delimiters — especially with CJK text.
- Color presets: append a class — `==content=={.warning}`, `==content=={.tip}`.
  Available types: `info`, `note`, `tip`, `warning`, `danger`, `caution`, `important`.
- Use `\==` to output a literal `==`.

## Animation mode

```ts
markdown: { mark: 'eager' } // default; 'lazy' plays when scrolled into view
```

## Styling

```css
:root {
  --vp-mark-text: var(--vp-c-text-1);
  --vp-mark-bg: linear-gradient(transparent 60%, var(--vp-c-brand-soft) 40%);
  --vp-mark-linear-color: var(--vp-c-brand-2);
  --vp-mark-bg-shift: 0 0.35em;
  --vp-mark-bg-image: none;
}
```
