# Code Tree

A file tree with the code of each file — the tree is built from the code block titles.

## Enable

```ts
markdown: {
  codeTree: true,
  // or
  codeTree: { icon: 'colored', height: '400px', ignores: ['node_modules'], loaders: {} },
}
```

`icon` accepts `'colored'` (default) or `'simple'`.

## Inline container

````md
::: code-tree title="项目" height="400px" entry="src/main.ts" showSidebar

```ts title="src/main.ts"
console.log('hi')
```

```json title="package.json"
{ "name": "demo" }
```

:::
````

| Container option | Meaning |
| --- | --- |
| `title` | tree panel title |
| `height` | panel height, a bare number is treated as `px` |
| `entry` | file expanded first (defaults to the first file) |
| `showSidebar` | show the file sidebar (hidden by default) |

Use `:active` on a code block to mark the expanded file when `entry` is omitted.

## Import from a directory

```md
@[code-tree](src/components)
@[code-tree title="组件" height="500" entry="Button.ts" showSidebar](src/components)
```

Paths resolve against `sourceDir`. Files not readable/ignored (see `ignores`) are skipped.
