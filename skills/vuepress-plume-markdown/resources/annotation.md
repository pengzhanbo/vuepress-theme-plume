# Annotation

Inline annotations revealed on click.

## Enable

```ts
markdown: { annotation: true }
```

## Syntax

```md
本站由 VuePress [+vuepress] 驱动。

[+vuepress]: VuePress 是一个静态站点生成器（SSG）。
```

- Marker: `[+label]`, with a space before `[+`.
- Definition: `[+label]: content` — content may continue on indented following lines.
- Defining the same label more than once renders the annotations as a list:

```md
用到了 [+vue] 的一些特性 [+vue]。

[+vue]: 响应式系统
[+vue]: 单文件组件
```

## Presets

```ts
markdown: {
  annotation: true,
  annotation: { vuepress: '一个 VuePress 主题' }, // same as `markdown.env.annotations`
}
```

`markdown.env.annotations` accepts `string | string[]` per label; page-level definitions take precedence over
presets, which take precedence over `markdown.env`.
