---
url: /en/guide/features/reader/index.md
---
## Overview

The reader preferences let the reader decide how a page reads: how wide the text column is, what the background looks like, whether a reading aid is shown, and whether to enter focus mode.

Once enabled, a "Reading" entry appears in the top-right corner. Changes apply immediately, are stored in the browser, and survive the next visit to the same site.

The feature is off by default; one switch turns it on.

:::: tip When to use it

Long-form documentation, tutorials and blogs, where readers lose their place in a long article or find a white page glaring at night.

::::

## Quick start

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: true, // [!code hl]
  }),
})
```

`true` uses every default. See [Theme config · readerPreferences](../../config/theme.md#readerpreferences) for all options.

The entry follows the viewport:

| Viewport | Entry |
| --- | --- |
| `≥ 1280px` | Icon button on the right of the navbar |
| `768 ~ 1280px` | "More" flyout, next to the appearance switch |
| `< 768px` | "Reading" group in the mobile navigation drawer |

Changes apply immediately, nothing to save. "Reset" clears every choice; the mobile drawer has no such button.

## Features

| Feature | What it does | Default |
| --- | --- | --- |
| Continue reading | On a revisit, prompts "Last read 62%" with **Continue** and **Start over** | On |
| Content width | Four presets (narrow / standard / wide / full) that only resize the text column | All four offered |
| Reading background | Default / warm / sepia backgrounds; code blocks, tables, hints and the navbar change with it | On |
| Brand color | Replaces the site accent, in both light and dark mode | Hidden until configured |
| Reading aid | Highlights the paragraph under the mouse as a mask, a left or a right guide line | Off |
| Focus mode | Hides the navbar, sidebar, outline and footer; exit with `Esc` or the button in the bottom-right corner | On |

Continue reading only prompts, it never scrolls the page.

### The four widths

| Preset | Text width | Notes |
| --- | --- | --- |
| Narrow | about 640px | Close to a book line length, good for long reading sessions |
| Standard | whatever the theme already uses | The default, identical to a site without this feature |
| Wide | about 1000px | More content visible on a large screen |
| Full | follows the viewport | Fills the viewport, for ultra-wide screens and chart-heavy pages |

"Standard" writes no CSS at all, so a reader who stays on it sees exactly the previous layout. After a width change, components that depend on the window size (charts, for instance) are recalculated.

## Configuration

### Turn off some features

Every item can be disabled on its own; the matching group then disappears from the panel:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      theme: false, // no reading background
      readAid: false, // no reading aid
      focusMode: false, // no focus mode
    },
  }),
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `false \| { presets }` | `true` | Content width presets |
| `theme` | `false \| { presets }` | `true` | Reading background |
| `brand` | `false \| { presets }` | `false` | Brand colors |
| `readAid` | `false \| 'mask' \| 'left' \| 'right' \| { modes, default }` | `true` | Reading aid |
| `focusMode` | `boolean` | `true` | Focus mode |
| `resume` | `false \| ReaderResumeOptions` | `true` | Continue reading |
| `storagePrefix` | `string` | `'plume'` | Prefix of the browser storage keys |

### Limit the widths offered

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      width: { presets: ['wide', 'full'] },
    },
  }),
})
```

"Standard" is always kept, it means "no adjustment". A preset you leave out is not offered.

### Continue reading

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      resume: { prompt: true, ttl: 30, max: 100, minPercent: 0.1 },
    },
  }),
})
```

| Option | Default | Description |
| --- | --- | --- |
| `prompt` | `true` | `false` records the position without prompting |
| `ttl` | `90` | Days a record is kept, 1–365 |
| `max` | `300` | Max records kept, 10–1000 |
| `minPercent` | `0.05` | Don't prompt below this progress, `0`–`1` |

### Reading aid

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      readAid: true, // all three modes, the reader picks
      // readAid: 'left', // the left guide line as the default mode
      // readAid: { modes: ['mask'], default: 'mask' }, // offer the mask only
    },
  }),
})
```

`mask` is a mask following the mouse, `left` and `right` draw a guide line on that side.

The legacy `readAid` in a collection or a locale still works, as the default while the reader has not chosen one.

### Custom palettes

Backgrounds and brand colors are both described as palettes: a name plus a set of CSS custom properties. The panel renders them as solid swatches.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      theme: {
        presets: [
          'default',
          'warm',
          {
            name: 'forest',
            label: 'Forest',
            tokens: {
              'vp-c-bg': '#eef5ec',
              'vp-c-bg-alt': '#e6efe3',
              'vp-c-text-1': '#2b3529',
            },
          },
        ],
      },
      brand: {
        presets: [
          { name: 'ocean', label: 'Ocean', tokens: { 'vp-c-brand-1': '#0e7490' } },
        ],
      },
    },
  }),
})
```

* `default` (a slashed swatch) keeps the theme colors and is always first;
* a swatch color defaults to `--vp-c-bg` / `--vp-c-brand-1`, override it with `color`;
* the keys of `tokens` may omit the `--` prefix; the usual background tokens are `--vp-c-bg`, `--vp-c-bg-alt`, `--vp-c-bg-soft`, `--vp-c-bg-elv`, `--vp-c-text-1` ~ `--vp-c-text-3`, `--vp-c-divider` and `--vp-code-block-bg`;
* a group that ends up with only `default` is hidden.

:::: warning The reading background excludes dark mode

In dark mode the background group is disabled: "dark + sepia" is unreadable. Dark mode itself is still owned by `appearance`.

::::

### Per language

Reader preferences apply per locale, so configure them in `locales`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': { readerPreferences: { readAid: true } },
      '/en/': { readerPreferences: { readAid: false } },
    },
  }),
})
```

Switching the language switches what the panel offers. The choices themselves are a single set per origin; give each locale a different `storagePrefix` to keep them apart.

### Panel texts

Every label in the panel can be rewritten in `locales`, see [I18n config · Reader](../../config/locales.md#reader).

## Per-site customization

### Disable for one page

Turn it off in the frontmatter; the page then records no position and offers no prompt:

```md
---
title: A page that should not be tracked
reader: false
---
```

See [Common Frontmatter · reader](../../config/frontmatter/basic.md#reader).

### Several sites on one origin

Choices are stored per origin, so several sites on one domain overwrite each other. Give each site its own prefix:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      storagePrefix: 'my-docs',
    },
  }),
})
```

### Custom styles

The reader's choice is written to `data-reader-*` attributes on `<html>`:

```css title=".vuepress/styles/index.css"
/* when the reader picks "wide", go a little wider */
html[data-reader-width="wide"] .vp-doc-container .content-container {
  max-width: 1080px;
}
```

The attributes are `data-reader-width` (`narrow` / `wide` / `full`), `data-reader-theme`, `data-reader-brand` and `data-reader-focus`; "standard" and "default" write nothing. See [Custom styles](../custom/style.md) for how to load the file.

## Small screens

Content width, reading aid and focus mode are desktop-only: below a `768px` viewport they are disabled, hidden from the panel and fall back to their defaults.

| Control | On small screens | Why |
| --- | --- | --- |
| Content width | Standard | The text already fills the screen; another preset does nothing or narrows it for no reason |
| Reading aid | Off | No mouse hover on touch screens |
| Focus mode | Off | The navbar is the only way into the navigation drawer |
| Reading background / brand color | Kept | Unrelated to the screen size |

The desktop choice is not erased, it applies again as soon as the screen is wide enough, and a small screen never flashes a wide layout first.

A locale that enables only those three controls and configures no palette gets no reader entry on small screens — there would be nothing left in the panel.
