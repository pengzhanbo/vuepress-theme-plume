---
url: /en/guide/markdown/mark/index.md
---
## Overview

The ==marker pen== feature extends Markdown's `==Mark==` syntax, allowing text to be marked with various colors and customizable options.

## Syntax

### Basic Usage

Use `== ==` to mark text. Note the spaces around the equals signs.

**Input:**

```md
vuepress-theme-plume is a ==simple and beautiful== theme
```

**Output:**

vuepress-theme-plume is a ==simple and beautiful== theme

### Color Customization

Different marker pen colors are set using [Markdown attribute syntax](./extensions.md#attribute-support).

Add `{.classname}` immediately after the `==Mark==` syntax to customize colors.

**Input:**

```md
==a tip=={.tip} ==a warning=={.warning} ==an error=={.danger} ==important content=={.important}
```

**Output:**

\==a tip=={.tip} ==a warning=={.warning} ==an error=={.danger} ==important content=={.important}

## Built-in Color Schemes

The theme includes these predefined schemes:

* **default**: `==Default==` - ==Default==
* **info**: `==Info=={.info}` - ==Info=={.info}
* **note**: `==Note=={.note}` - ==Note=={.note}
* **tip**: `==Tip=={.tip}` - ==Tip=={.tip}
* **warning**: `==Warning=={.warning}` - ==Warning=={.warning}
* **danger**: `==Danger=={.danger}` - ==Danger=={.danger}
* **caution**: `==Caution=={.caution}` - ==Caution=={.caution}
* **important**: `==Important=={.important}` - ==Important=={.important}

## Custom Color Schemes

Marker pen can be customized via [custom styles](../custom/style.md).

You can fully customize highlighter colors, including modifying built-in schemes.

Within the theme, markers are set using the combination of `class name` and `CSS variables`.

The following are `CSS variables` related to markers:

* `--vp-mark-text` - Text color of marker pen
* `--vp-mark-bg` - Background color of marker pen
* `--vp-mark-linear-color` - gradient color, only used in the built-in `--vp-mark-bg-image`
* `--vp-mark-bg-shift` - Built in gradient background offset of marker pen
* `--vp-mark-bg-image` - Background image of marker pen

### Modifying Built-in Schemes

Copy these built-in configurations to your [style file](../custom/style.md#style-file) for modification:

```css :collapsed-lines
mark {
  --vp-mark-text: currentcolor;
  --vp-mark-bg: transparent;
  --vp-mark-bg-shift: 0.55lh;
  --vp-mark-linear-color: var(--vp-c-brand-3);
  --vp-mark-bg-image: linear-gradient(to right, var(--vp-mark-linear-color) 50%, transparent 50%);
  animation: var(--vp-mark-animation, mark-highlight 1.5s 0.5s forwards);
}

[data-mark-mode="lazy"] mark {
  --vp-mark-animation: none;
}

[data-mark-mode="lazy"] mark.vp-mark-visible {
  animation: mark-highlight 1.5s 0.2s forwards;
}

mark.note {
  --vp-mark-linear-color: #ff0;
}

mark.info {
  --vp-mark-linear-color: var(--vp-c-default-1);
}

mark.tip {
  --vp-mark-linear-color: #39ff14;
}

mark.warning {
  --vp-mark-linear-color: #fc0;
}

mark.caution, mark.danger {
  --vp-mark-linear-color: #f99;
}

mark.important {
  --vp-mark-linear-color: #ccf;
}

[data-theme="dark"] mark.note {
  --vp-mark-linear-color: #660;
}

[data-theme="dark"] mark.tip {
  --vp-mark-linear-color: #063;
}

[data-theme="dark"] mark.warning {
  --vp-mark-linear-color: #c60;
}

[data-theme="dark"] mark.caution,
[data-theme="dark"] mark.danger {
  --vp-mark-linear-color: #c66;
}

[data-theme="dark"] mark.important {
  --vp-mark-linear-color: #66c;
}
```

### Adding New Schemes

Add new color schemes in your [style file](../custom/style.md#style-file) using this format:

```css
mark.classname {
  --vp-mark-text: marktext;  /* Text color */
  --vp-mark-bg-image: none;  /* Background image */
  --vp-mark-bg: mark;        /* Background color */
  --vp-mark-linear-color: mark;  /* Gradient color */
}
```

Use `==Mark=={.classname}` in Markdown.

You can name `classname` freely and add other CSS properties besides modifying CSS variables.

## Animation Modes

By default, the highlight animation plays as soon as the page renders.

If you prefer to animate only when the marker enters the viewport, set `markdown.mark` to `'lazy'` in your theme config:

```ts title=".vuepress/config.ts" {5}
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      mark: 'lazy',
    },
  }),
})
```
