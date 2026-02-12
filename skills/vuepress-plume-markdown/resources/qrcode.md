# QR Code

Generate QR codes from text.

## Syntax

- **Inline**: `@[qrcode](text)`
- **Container**:

  ```md
  ::: qrcode [card] [title="..."]
  text
  :::
  ```

## Attributes

`card`, `svg`, `title="name"`, `align="center"`.

## Example

```md
@[qrcode](https://example.com)

::: qrcode card title="Scan Me"
https://example.com
:::
```
