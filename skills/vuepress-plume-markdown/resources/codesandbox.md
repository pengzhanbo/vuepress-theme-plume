# CodeSandbox Embed

Embed CodeSandbox projects in your markdown files.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeSandbox: true
    }
  })
})
```

## Syntax

```md
@[codesandbox](sandbox_id)

@[codesandbox](sandbox_id title)
```

## Parameters

- `sandbox_id` - The CodeSandbox sandbox ID
- `title` - Optional title for the embed

## Example

**Input:**

```md
@[codesandbox](react-new)

@[codesandbox](vue-vue "Vue Demo")
```

## Getting Sandbox ID

1. Open the CodeSandbox project
2. Copy the ID from the URL: `codesandbox.io/s/XXXXXX`
3. Use `XXXXXX` as the sandbox ID

## Features

- Full IDE embedded
- Live preview
- File navigation
- Code editing capabilities
