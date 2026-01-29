# Code Tree

Display a file tree alongside code blocks.

## Syntax

````md
::: code-tree title="Project Name" height="400px" entry="src/main.ts"
```lang title="src/main.ts"
// code
```

```lang title="package.json"
// code
```
:::
````

- `entry`: Default expanded file path.
- `title` on code blocks: Defines the file path in the tree.

## Import from Directory

```md
@[code-tree](dir_path)
```
