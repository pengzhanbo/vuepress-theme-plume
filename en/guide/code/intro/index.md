---
url: /en/guide/code/intro/index.md
---
## Overview

The theme uses [Shiki](https://shiki.style/) to implement syntax highlighting in Markdown code blocks.

::: important Important Changes&#x20;

Starting from version ==1.0.0-rc.136==, the theme has migrated the code highlighting plugin from the
internally implemented `@vuepress-plume/plugin-shikiji` to
[@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html)
provided by the [vuepress ecosystem](https://github.com/vuepress/ecosystem).

*(No need to worry about significant changes - I am also one of the main developers of*
*`@vuepress/plugin-shiki`, which implements functionality consistent with the theme's original plugin.)*

Some configuration items require adjustments:

* The `languages` configuration has been changed to the `langs` option. You no longer need to manually
  add the languages you use; the plugin will automatically recognize and load language packages as needed.
* The `themes` configuration has been changed to:
  * When using a single theme configuration, use the `theme` option to configure the code block theme
  * When using dual theme configuration, use the `themes` option to configure the code block themes.

:::

## Languages

[Shiki](https://shiki.style/) supports over 190+ languages.
You can view the complete list of supported languages at [languages](https://shiki.style/languages).

You can use the following syntax to enable highlighting for code written in your chosen language:

````md
``` [lang]
<!-- Your code content -->
```
````

Where `[lang]` represents the programming language you are using.

Example:

````md
// [!code word:js]
``` js
const a = 1
console.log(a)
```
````

```js
const a = 1
console.log(a)
```

## Highlighting Themes

[Shiki](https://shiki.style/) supports over 40+ highlighting themes.

You can find the complete list of supported themes at [Themes](https://shiki.style/themes) and
customize the highlighting theme according to your preference.

Theme Plume's default configuration for code block themes:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' }, // [!code highlight]
    }
  })
})
```

The default configuration supports using the `vitesse-light`/`vitesse-dark` themes for light/dark modes respectively.

## Additional Features

Thanks to the powerful capabilities of [Shiki](https://shiki.style/), Theme Plume provides additional
[feature support](./features.md) for code blocks, enhancing their expressive power.

Additionally, to facilitate better code demonstrations, Theme Plume provides syntax support for embedding
[CodePen](../repl/codepen.md), [Js Fiddle](../repl/jsFiddle.md), [Code Sandbox](../repl/codeSandbox.md),
and [Replit](../repl/replit.md), allowing you to easily embed code demonstrations.

## Examples
