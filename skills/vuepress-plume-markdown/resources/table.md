# Table Container

Enhanced table containers with additional styling options.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      table: true // or TableContainerOptions
    }
  })
})
```

## Syntax

```md
::: table [Title]

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

:::
```

## Example

**Input:**

```md
::: table API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/users | List all users |
| POST   | /api/users | Create new user |
| GET    | /api/users/:id | Get user by ID |

:::
```

## Features

- Styled container wrapper
- Responsive scrolling
- Optional title/header
- Consistent styling with theme

## Use Cases

- API documentation
- Comparison tables
- Data reference
- Configuration options
