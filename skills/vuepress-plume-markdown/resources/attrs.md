# Attributes

Add classes / ids / attributes with `{...}`. Enabled by default, no config.

```md
**bold**{.red}
[link](https://example.com){target=_blank rel="noopener noreferrer"}
## 标题 {#custom-id}
![alt](/img.png){width=200}
```

| Form | Placement |
| --- | --- |
| Inline element | immediately after it, no space: `__bold__{.red}` |
| List | on the **next line**, no blank line in between |
| Table | **after a blank line** following the table |
| Heading / paragraph | next line is also accepted |

Values containing spaces must be quoted: `{title="带空格的值"}`.

## Examples

```md
- 列表项 **加粗**
{.red .large}

| 列 | 列 |
| --- | --- |
| a | b |

{.special}

### 标题 {#anchor .title-class}
```

## Table cell merge

```md
| 1 | 2 {colspan=2} | 3 |
| --- | --- | --- |
| 4 {rowspan=3} | 5 | 6 |
```

`colspan` / `rowspan` only apply to table cells.

## Related uses in this theme

- `{.no-view}` / `{.ignore}` — skip the image preview
- `{.link}` — force styling of a link
- `{.no-link-preview}` — disable the inline link preview for that link
- `{data-outline="5"}` — extend the right-hand outline depth for a heading
