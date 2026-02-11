# Flex Container

Apply Flexbox layout using `::: flex`.

## Syntax

```md
::: flex [justify] [align] [gap="20"] [column]
Block 1

Block 2
:::
```

- Justify: `center`, `between`, `around`
- Align: `start`, `center`, `end`
- `column`: Vertical direction.

## Example

```md
::: flex between center
| Table 1 |
| ------- |

| Table 2 |
| ------- |
:::
```
