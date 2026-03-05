# JSFiddle Embed

Embed JSFiddle demos in your markdown files.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      jsfiddle: true
    }
  })
})
```

## Syntax

```md
@[jsfiddle](fiddle_id)

@[jsfiddle](fiddle_id title)

@[jsfiddle](fiddle_id title tabs)
```

## Parameters

- `fiddle_id` - The JSFiddle fiddle ID
- `title` - Optional title for the embed
- `tabs` - Optional tabs to show: `js`, `css`, `html`, `result` (comma-separated)

## Example

**Input:**

```md
@[jsfiddle](abc123)

@[jsfiddle](abc123 "My Fiddle")

@[jsfiddle](abc123 "My Fiddle" html,css,result)
```

## Getting Fiddle ID

1. Open the JSFiddle
2. Copy the ID from the URL: `jsfiddle.net/username/XXXXXX/`
3. Use `XXXXXX` as the fiddle ID

## Features

- Embedded fiddle preview
- Tab-based navigation
- Live code editing
- Result preview
