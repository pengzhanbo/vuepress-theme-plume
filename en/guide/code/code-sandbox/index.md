---
url: /en/guide/code/code-sandbox/index.md
---
The theme supports embedding [Code Sandbox](https://codesandbox.io) in Markdown files.

## Configuration

This feature is disabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codesandbox: true, // [!code highlight]
    },
  })
})
```

## Syntax

### Basic Syntax

Embed Code Sandbox in the page:

```md
@[codesandbox](id)
```

Use Code Sandbox redirect button:

```md
@[codesandbox button](workspace/id)
```

### Extended Options

```md
@[codesanbox title="xxx" layout="Editor+Preview" height="500px" navbar="false" console](id#filepath)
```

* `id`: Code Sandbox identifier
* `title`: Code Sandbox title
* `layout`: Code preview layout, options: `Preview`, `Editor`, `Editor+Preview`
* `height`: Code preview height
* `navbar`: Whether to display navigation bar, defaults to true
* `console`: Whether to display console, defaults to false
* `filepath`: File path

## Examples

Code Sandbox redirect button:

```md
@[codesandbox button](reaction/5wyzu)
```

Output:

@[codesandbox button](reaction/5wyzu)

Code Sandbox embedded in page:

```md
@[codesandbox](5wyzu)
```

Output:

@[codesandbox](5wyzu)
