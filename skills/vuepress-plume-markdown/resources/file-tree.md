# File Tree

Display directory structure using `::: file-tree`.

## Syntax

Use unordered lists.

- `++`: Added file/dir.
- `--`: Deleted file/dir.
- `**name**`: Bold name.
- `/` at end of dir name: Hide contents (if not listed).
- `...` or `…`: Placeholder.

## Example

```md
::: file-tree title="Structure" icon="simple"
- root
  - .vuepress
    - ++ config.ts
  - -- old-file.md
  - src/
  - README.md
  - ...
:::
```
