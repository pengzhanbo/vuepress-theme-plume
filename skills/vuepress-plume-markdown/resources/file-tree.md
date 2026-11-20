# File Tree

Enabled by default (`markdown.fileTree: true`).

## Container

```md
::: file-tree title="项目结构" icon="simple"
- docs
  - .vuepress
    - config.ts
  - README.md
:::
```

| Option | Meaning |
| --- | --- |
| `title` | panel title |
| `icon` | `'colored'` (default) or `'simple'` |

Markers inside the list:

| Marker | Effect |
| --- | --- |
| `++ file` | added |
| `-- file` | removed |
| `**file**` | highlighted / bold |
| `dir/` (trailing slash) | treat as folder; its children are hidden unless listed |
| `...` or `…` | placeholder for omitted entries |
| `name # 注释` | inline comment (only in the code-block form) |

## Fenced form

````md
```file-tree
src
├── components
│   └── Button.vue
└── index.ts
```
````

````md
```tree icon="simple"
├── src
│   ├── index.ts # 入口
│   └── utils.ts
└── package.json
```
````

The `tree` / `file-tree` fences accept tree-drawing characters (`├──`, `└──`, `│`) as shown, and support `#`
comments.
