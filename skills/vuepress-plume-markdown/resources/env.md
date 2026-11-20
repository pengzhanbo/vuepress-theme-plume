# Environment presets (`markdown.env`)

Define link references, abbreviations and annotations once in the config and use them in **every** markdown file.

```ts
markdown: {
  abbr: true,       // required for `*[ABBR]: ...` and env.abbreviations
  annotation: true, // required for `[+label]` and env.annotations
  env: {
    references: {
      vuepress: 'https://v2.vuepress.vuejs.org/',
      plume: { href: 'https://theme-plume.vuejs.press/', title: 'Plume Theme' },
    },
    abbreviations: {
      HTML: 'Hypertext Markup Language',
    },
    annotations: {
      plume: '一个 VuePress 主题',
      '名著': ['《红楼梦》', '《西游记》'],
    },
  },
}
```

Usage in any page:

```md
[链接引用][vuepress]

缩写：HTML

注释：Plume [+plume]
```

- `references` always work (standard markdown link references).
- `abbreviations` need `markdown.abbr`; `annotations` need `markdown.annotation`.
- Priority: definitions inside the page **>** `markdown.abbr` / `markdown.annotation` maps **>** `markdown.env` presets.
- A label defined twice in `markdown.annotation` renders as a list when referenced.
