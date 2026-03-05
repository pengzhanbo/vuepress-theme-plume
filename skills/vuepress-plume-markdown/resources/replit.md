# Replit Embed

Embed Replit projects in your markdown files.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: true
    }
  })
})
```

## Syntax

```md
@[replit](replit_url)

@[replit](replit_url title)
```

## Parameters

- `replit_url` - The full Replit project URL
- `title` - Optional title for the embed

## Example

**Input:**

```md
@[replit](https://replit.com/@username/project-name)

@[replit](https://replit.com/@username/python-demo "Python Demo")
```

## Features

- Full Replit IDE embedded
- Live code editing
- Console output
- Multi-file support
- Run button for execution

## Supported Languages

Replit supports 50+ programming languages including:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- Ruby
- And more...
