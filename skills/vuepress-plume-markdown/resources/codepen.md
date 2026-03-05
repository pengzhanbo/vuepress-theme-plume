# CodePen Embed

Embed CodePen demos in your markdown files.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codepen: true
    }
  })
})
```

## Syntax

```md
@[codepen](pen_id)

@[codepen](pen_id title)

@[codepen](pen_id title tab)
```

## Parameters

- `pen_id` - The CodePen pen ID (from URL: codepen.io/user/pen/**XXXXXX**)
- `title` - Optional title for the embed
- `tab` - Optional default tab: `html`, `css`, `js`, `result` (default: `result`)

## Example

**Input:**

```md
@[codepen](VwKZgJG)

@[codepen](VwKZgJG "My Demo")

@[codepen](VwKZgJG "My Demo" css)
```

## Getting Pen ID

1. Open the CodePen pen
2. Copy the ID from the URL: `codepen.io/username/pen/XXXXXX`
3. Use `XXXXXX` as the pen ID

## Features

- Embedded iframe preview
- Editable code (if enabled on CodePen)
- Responsive sizing
- Dark/light theme support
