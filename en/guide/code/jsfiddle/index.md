---
url: /en/guide/code/jsfiddle/index.md
---
The theme supports embedding [JS Fiddle](https://jsfiddle.net/) in Markdown files.

## Configuration

This feature is disabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      jsfiddle: true, // [!code highlight]
    },
  })
})
```

## Syntax

### Basic Syntax

```md
@[jsfiddle](user/id)
```

### Extended Options

```md
@[jsfiddle theme="dark" tab="js,css,html,result" height="500px"](user/id)
```

* `user`: Username
* `id`: JS Fiddle identifier
* `theme`: Theme mode, options: `"light" | "dark"`
* `tab`: Active tabs, options: `"js" | "css" | "html" | "result"`, multiple values separated by `","`.
  The order determines tab arrangement, defaults to `js,css,html,result`
* `height`: Container height

## Examples

Input:

```md
@[jsfiddle](pengzhanbo/1xbwz2p9)
```

Output:

@[jsfiddle](pengzhanbo/1xbwz2p9)

Input:

```md
@[jsfiddle tab="result,js,css,html"](pengzhanbo/1xbwz2p9)
```

Output:

@[jsfiddle tab="result,js,css,html"](pengzhanbo/1xbwz2p9)
