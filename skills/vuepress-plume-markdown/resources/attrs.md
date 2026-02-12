# Attributes

Add classes, IDs, and attributes to Markdown elements using `{ }`.

## Syntax

- **Inline**: Place `{.class #id attr=value}` immediately after the element.
- **Block**: Place `{.class #id attr=value}` on the line immediately following the block.

## Examples

### Inline

```md
__bold__{.red}
[link](https://example.com){target=_blank}
```

### Headers

```md
## Heading{#custom-id}
```

### Blocks (List/Table)

```md
- list item

{.red}

| header |
| ------ |
| cell   |

{.table-class}
```

### Table Cells (Merge)

```md
| 1 | 2 {colspan=2} |
```
