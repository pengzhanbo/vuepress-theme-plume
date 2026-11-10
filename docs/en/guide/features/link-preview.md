---
title: Link Preview
icon: fluent:preview-link-24-regular
createTime: 2026/11/10 10:00:00
permalink: /en/guide/features/link-preview/
badge: NEW
---

## Overview

While reading docs, a sentence like `see [configuration](../config/theme.md)` forces the
reader to click through before knowing whether it is worth it. Link previews show the title,
excerpt, tags and last updated date of the target page when the pointer rests on an internal
link, so readers can decide **without leaving the current page**.

::: info **Link Preview** disabled by default
:::

## Getting started

::::: steps

1. **Enable the feature**

   `true` uses all defaults:

   ```ts title=".vuepress/config.ts"
   import { defineUserConfig } from 'vuepress'
   import { plumeTheme } from 'vuepress-theme-plume'

   export default defineUserConfig({
     theme: plumeTheme({
       linkPreview: true,
     }),
   })
   ```

2. **Tune it**

   Passing an object overrides any default. Documentation sites usually benefit from
   showing the headings of the target page:

   ```ts title=".vuepress/config.ts"
   export default defineUserConfig({
     theme: plumeTheme({
       linkPreview: {
         showHeadings: true,
         excerptLength: 120,
         maxWidth: 360,
       },
     }),
   })
   ```

3. **Build and check**

   ```sh
   pnpm docs:build
   ```

:::::

### Enable for one locale only

The option is resolved **per locale** and locale level values win over the theme level:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    linkPreview: true,
    locales: {
      '/en/': { linkPreview: false },
    },
  }),
})
```

## Card content

| Content | Source | Notes |
| --- | --- | --- |
| Title | Rendered title of the target page | Always equals the target **title** |
| Excerpt | `frontmatter.description` → first paragraph | Plain text, no Markdown syntax, HTML tags or code blocks |
| Headings | First `##` headings of the target page | Only with `showHeadings: true` |
| Tags | `frontmatter.tags` of the target page | At most 4 |
| Updated | `updatedTime` from the git plugin | Omitted when there is no git data |

## Disabling previews

From the widest to the narrowest scope:

| Scope | How |
| --- | --- |
| Whole site | `linkPreview: false` (default) |
| One locale | `locales: { '/en/': { linkPreview: false } }` |
| One page | frontmatter `linkPreview: false` |
| One target page never shown | `linkPreview: { exclude: ['/changelog/**'] }` |
| One link | `<a href="/x/" data-no-link-preview>` or `<a href="/x/" class="no-link-preview">` |

The opt-out marker works for both Markdown links and raw HTML anchors:

```md
[no preview](/guide/features/link-preview/){.no-link-preview}
```

## Coverage

The following forms do **not** trigger a preview:

- Raw HTML relative anchors such as `<a href="../x.md">`: the browser resolves them against
  the current page URL, so they only have a preview when they point to a real route;
- Links generated inside Vue components, e.g. `<VPLinkCard>`, `<VPLink>`;
- External links: previews only target internal pages.

## Safety

- **Encrypted and draft pages never appear in preview data**;
- Only public page metadata is written, no existing output is changed;
- When disabled, no page data field is produced, no listener is bound and no DOM is rendered.

::::

## FAQ

:::: details Why does a link have no preview?

- The target page does not exist (renamed, typo, or a stale link after a `permalink` change);
- The target page is encrypted or a draft;
- The target page matches `exclude`;
- The link is not a Markdown internal link (see [Coverage](#coverage));
- The current page sets `linkPreview: false`, or the feature is disabled.

::::

:::: details I edited a target page title in dev, but the preview is stale

Preview data belongs to the source page's page data. After editing the target page, the
source page data is recomputed, but the source page module has to re-render — **refresh the
page**.

::::

:::: details Why is the card not clickable?

"hover → move the mouse → card disappears" makes a clickable card a new usability problem,
and a second clickable target inside the card pollutes the `Tab` order. The card is
informational only: it shows the target of the link itself.

::::
