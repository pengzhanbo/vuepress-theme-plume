# File Include

Include content from other files.

## Syntax

```md
<!-- @include: filename -->
```

- **Lines**: `<!-- @include: filename{1-10} -->`
- **Region**: `<!-- @include: filename#region-name -->`
  - In source file: `<!-- region region-name -->` ... `<!-- endregion region-name -->`

## Example

```md
<!-- @include: ./snippet.md -->
<!-- @include: ./snippet.md{1-5} -->
<!-- @include: ./snippet.md#snippet-name -->
```
