---
url: /en/guide/code/replit/index.md
---
\~~The theme supports embedding [Replit](https://replit.com/) in Markdown files.~~

## Configuration

This feature is disabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      replit: true, // [!code ++]
    },
  })
})
```

## Syntax

Basic syntax:

```md
@[replit](user/repl-name)
```

Extended options:

```md
@[replit title="" width="100%" height="450px" theme="dark"](user/repl-name#filepath)
```

* `title`: Title
* `width`: Container width
* `height`: Container height
* `theme`: Theme, options: `dark` and `light`
* `user`: Replit username
* `repl-name`: Replit repl name
* `filepath`: Default file path to open in Replit

## Examples

Input:

```md
@[replit](@TechPandaPro/Cursor-Hangout#package.json)
```

Output:

@[replit](@TechPandaPro/Cursor-Hangout#package.json)
