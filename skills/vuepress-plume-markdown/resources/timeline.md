# Timeline

Create a timeline using `::: timeline`.

## Syntax

- Container config: `horizontal`, `card`, `line="style"`, `placement="right|between"`.
- Item config (line after title): `time="date"`, `type="info|success|..."`, `icon=""`.

## Example

```md
::: timeline
- Event 1
  time=2023-01-01 type=success

  Content 1

- Event 2
  time=2023-02-01 type=warning icon=mdi:alert

  Content 2
:::
```
