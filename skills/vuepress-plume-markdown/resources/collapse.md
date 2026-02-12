# Collapse

Create collapsible panels using `::: collapse`.

## Syntax

```md
::: collapse [accordion] [expand]
- Title 1
  Content 1

- Title 2
  Content 2
:::
```

- `accordion`: Only one panel expanded at a time.
- `expand`: Expand all by default.
- `:+ Title`: Mark specific item as expanded.
- `:- Title`: Mark specific item as collapsed.

## Example

```md
::: collapse accordion
- Panel 1
  Content 1

- :+ Panel 2 (Initially Expanded)
  Content 2
:::
```
