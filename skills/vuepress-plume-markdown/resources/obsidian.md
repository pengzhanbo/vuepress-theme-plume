# Obsidian compatibility

`markdown.obsidian` is **enabled by default** and makes Obsidian-flavoured markdown work in Plume:

```ts
markdown: {
  obsidian: true, // default
  obsidian: { wikiLink: true, embedLink: true, callout: true, comment: true },
}
```

Set `obsidian: false` to fall back to the standard renderers (then GitHub alerts are rendered by
`@vuepress/plugin-markdown-hint` instead of Obsidian callouts).

## Wiki links

```md
[[文件名]]
[[文件名#标题]]
[[文件名#标题#子标题]]
[[文件名|别名]]
[[文件名#标题|别名]]
[[https://example.com|外部链接]]
[[#当前文件内的标题]]
[[./]]  [[../]]  [[guide/]]      <!-- 目录列表 -->
```

Links resolve against the source directory, like normal relative links.

## Embeds

```md
![[文件名]]
![[文件名#标题#子标题]]
![[图片|300]]
![[图片|300x200]]
![[文档.pdf#page=1#height=300]]
![[音频文件]]
![[视频文件#height=400]]
```

Image embeds respect `markdown.imageSize`; PDF/audio/video embeds need `markdown.pdf`, `markdown.audioReader`,
`markdown.artPlayer` respectively.

## Callouts

```md
> [!note] 自定义标题
> 内容

> [!warning]
> 没有标题也合法
```

| Callout | Aliases |
| --- | --- |
| `note` | `quote`, `cite` |
| `tip` | `hint` |
| `info` | `todo` |
| `success` | `check`, `done` |
| `warning` | `question`, `help`, `faq` |
| `caution` | `attention`, `failure`, `fail`, `missing`, `danger`, `error`, `bug` |
| `important` | `example` |
| `details` | `abstract`, `summary`, `tldr` |

## Comments

```md
行内注释 %%不会渲染%%

%%
块级注释
可以跨多行
%%
```
