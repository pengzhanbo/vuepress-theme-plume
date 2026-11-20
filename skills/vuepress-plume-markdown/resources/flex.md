# Flex

Available by default. Lays out its children as a flex row.

```md
:::: flex center center gap="20" column wrap

| 表 1 |
| --- |

| 表 2 |
| --- |

::::
```

| Argument | Values | Meaning |
| --- | --- | --- |
| 1st positional | `center \| between \| around` | `justify-content` |
| 2nd positional | `start \| center \| end` | `align-items` |
| `gap="16"` | number | spacing in px (default `16`) |
| `column` | flag | vertical direction (`flex-direction: column`) |
| `wrap` | flag | `flex-wrap: wrap` |

Positional arguments are written bare (`:::: flex between center`), attributes as `key="value"`.
Nested containers inside `flex` need the outer marker to use 4+ colons.
