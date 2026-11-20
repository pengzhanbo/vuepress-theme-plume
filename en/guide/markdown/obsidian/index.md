---
url: /en/guide/markdown/obsidian/index.md
---
## Overview

The theme provides compatibility support for Obsidian's official Markdown extension syntax through the `vuepress-plugin-md-power` plugin,
enabling Obsidian users to write documentation using familiar syntax.

Currently supported Obsidian extension syntax includes:

* [Wiki Links](#wiki-links) - Syntax for inter-page linking
* [Embeds](#embeds) - Embed content from other files into the current page
* [Callout](#callout) - Highlight important information with styled containers
* [Comments](#comments) - Add comments visible only during editing

::: warning No plans to support extension syntax provided by Obsidian's third-party community plugins
:::

## Configuration

Obsidian compatibility features are all enabled by default. You can selectively enable or disable them through configuration:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      obsidian: {
        wikiLink: true, // Wiki Links
        embedLink: true, // Embeds
        callout: true, // Callout
        comment: true, // Comments
      },
      pdf: true, // PDF embed functionality
      artPlayer: true, // Video embed functionality
    },
  }),
})
```

### Configuration Options

:::: field-group

::: field wikiLink
@type `boolean`
@default `true`
Enable [Wiki Links](#wiki-links) syntax.
:::

::: field embedLink
@type `boolean`
@default `true`
Enable [Embeds](#embeds) syntax.
:::

::: field callout
@type `boolean`
@default `true`
Enable [Callout](#callout) syntax.
:::

::: field comment
@type `boolean`
@default `true`
Enable [Comments](#comments) syntax.
:::

::::

## Wiki Links

Wiki Links are syntax used in Obsidian for linking to other notes. Use double brackets `[[]]` to wrap content to create internal links.

### Syntax

```md
[[filename]]
[[filename#heading]]
[[filename#heading#subheading]]
[[filename|alias]]
[[filename#heading|alias]]
[[https://example.com|External Link]]
```

### Filename Search Rules

When using Wiki Links, filenames are matched according to the following rules:

**Match Priority:**

1. **Full Path** - Exact match against file paths
2. **Fuzzy Match** - Match filenames at the end of paths, prioritizing the shortest path

**Path Resolution Rules:**

* **Relative paths** (starting with `.`): Resolved relative to the current file's directory
* **Absolute paths** (not starting with `.`): Searched throughout the document tree, prioritizing the shortest path
* **Directory form** (ending with `/`): Matches `README.md` in that directory

**Example:**

Assuming the following document structure:

```txt
docs/
├── README.md
├── guide/
│   ├── README.md
│   └── markdown/
│       └── obsidian.md
```

In `docs/guide/markdown/obsidian.md`:

| Syntax             | Match Result                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `[[obsidian]]`     | Matches `docs/guide/markdown/obsidian.md` (matched via filename)                          |
| `[[./]]`           | Matches `docs/guide/markdown/README.md` (relative path)                                   |
| `[[../]]`          | Matches `docs/guide/README.md` (parent directory)                                         |
| `[[guide/]]`       | Matches `docs/guide/README.md` (directory form)                                           |

### Examples

**External Links:**

**Input:**

```md
[[https://example.com|External Link]]
```

**Output:**

\[\[https://example.com|External Link]]

**Internal Anchor Links:**

**Input:**

```md
[[npm-to]]  <!-- Search by filename -->
[[guide/markdown/math]]  <!-- Search by file path -->
[[#Wiki Links]]  <!-- Heading on current page -->
[[file-tree#Configuration]]  <!-- Search by filename, link to heading -->
```

**Output:**

\[\[npm-to]]

\[\[guide/markdown/math]]

\[\[#Wiki Links]]

\[\[file-tree#Configuration]]

[Obsidian Official - **Wiki Links**](https://obsidian.md/help/links){.readmore}

## Embeds

The embed syntax allows you to insert other file resources into the current page.

### Syntax

```md
![[filename]]
![[filename#heading]]
![[filename#heading#subheading]]
```

Filename search rules are the same as [Wiki Links](#filename-search-rules).

::: info Path resolution rules for embedded resources

* Starting with `./` or `../`: Resolved relative to the **current markdown file**
* Starting with `/`: Resolved from the site root, i.e., resources under `.vuepress/public/`
* A bare filename with no path prefix: The real file is first looked up relative to the current directory and the document root, and if not found, it is treated as `/filename`
  :::

### Image Embeds

**Syntax:**

```md
![[image]]
![[image|300]]
![[image|300x200]]
```

Supported formats: `jpg`, `jpeg`, `png`, `gif`, `avif`, `webp`, `svg`, `bmp`, `ico`, `tiff`, `apng`, `jfif`, `pjpeg`, `pjp`, `xbm`

**Example:**

::: warning This page's examples require the demo syntax to be enabled first
The `::: demo` syntax is **disabled by default**. When it is not enabled, the `md` code blocks
below are rendered as plain code blocks and no rendered output is shown.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      demo: true, // [!code ++]
    },
  }),
})
```

:::

::: demo markdown title="Basic Image" expanded

```md
![[images/custom-hero.jpg]]
```

:::

::: demo markdown title="Set Width" expanded

```md
![[images/custom-hero.jpg|300]]
```

:::

::: demo markdown title="Set Width and Height" expanded

```md
![[images/custom-hero.jpg|300x200]]
```

:::

### PDF Embeds

> \[!NOTE]
> PDF embeds require the `markdown.pdf` configuration option to be enabled for proper functionality.

**Syntax:**

```md
![[document.pdf]]
![[document.pdf#page=1]]  <!-- #page=1 means first page -->
![[document.pdf#page=1#height=300]]  <!-- #page=page number #height=height -->
```

Supported formats: `pdf`

***

### Audio Embeds

**Syntax:**

```md
![[audio file]]
```

Supported formats: `mp3`, `flac`, `wav`, `ogg`, `opus`, `webm`, `acc`

***

### Video Embeds

> \[!NOTE]
> Video embeds require the `markdown.artPlayer` configuration option to be enabled for proper functionality.

**Syntax:**

```md
![[video file]]
![[video file#height=400]]  <!-- Set video height -->
```

Supported formats: `mp4`, `webm`, `mov`, etc.

***

### Content Fragment Embeds

Content fragments under a specified heading can be embedded using `#heading`:

**Input:**

```md
![[my-note]]
![[my-note#Heading One]]
![[my-note#Heading One#Subheading]]
```

[Obsidian Official - **Insert Files**](https://obsidian.md/help/embeds){.readmore}
[Obsidian Official - **File Formats**](https://obsidian.md/help/file-formats){.readmore}

## Callout

Callout is a syntax for highlighting important information, similar to VuePress's `::: hint` container syntax.

### Syntax

```md
> [!note]
> Content
```

**Optional Title:**

```md
> [!tip] Custom Title
> Content
```

### Types

Callout supports the following types, with aliases automatically mapped to their corresponding primary types:

| Type | Aliases | Description |
| ---- | ------- | ----------- |
| `note` | `quote`, `cite` | Notes, quotes |
| `tip` | `hint` | Tips, hints |
| `info` | `todo` | Information, todos |
| `success` | `check`, `done` | Success, done |
| `warning` | `question`, `help`, `faq` | Warnings, questions, help |
| `caution` | `attention`, `failure`, `fail`, `missing`, `danger`, `error`, `bug` | Caution, failure, danger |
| `important` | `example` | Important, examples |
| `details` | `abstract`, `summary`, `tldr` | Details, summary |

### Examples

**Basic Usage:**

**Input:**

```md
> [!NOTE]
> This is a note callout.
```

**Output:**

> \[!NOTE]
> This is a note callout.

***

**With Title:**

**Input:**

```md
> [!TIP] Useful Tip
> Using `pnpm` can significantly speed up dependency installation.
```

**Output:**

> \[!TIP] Useful Tip
> Using `pnpm` can significantly speed up dependency installation.

***

**Multiple Types:**

**Input:**

```md
> [!success]
> Operation completed successfully!
>
> [!warning]
> This is a warning message.
>
> [!caution]
> Please proceed with caution, this action cannot be undone.
```

**Output:**

> \[!success]
> Operation completed successfully!

> \[!warning]
> This is a warning message.

> \[!caution]
> Please proceed with caution, this action cannot be undone.

***

**Details Type:**

The `details` type renders as an HTML `<details>` element, supporting collapse/expand:

**Input:**

```md
> [!details]
> Click to expand more content
>
> This is hidden content.
```

**Output:**

> \[!details]
> Click to expand more content
>
> This is hidden content.

[Obsidian Official - **Callout**](https://obsidian.md/help/callouts){.readmore}

## Comments

Content wrapped in `%%` is treated as a comment and will not be rendered on the page.

### Syntax

**Inline Comments:**

```md
This is an %%inline comment%% example.
```

**Block Comments:**

```md
%%
This is a block comment.
It can span multiple lines.
%%
```

### Examples

**Inline Comments:**

**Input:**

```md
This is an %%inline comment%% example.
```

**Output:**

This is an %%inline comment%% example.

***

**Block Comments:**

**Input:**

```md
Content before the comment

%%
This is a block comment.

It can span multiple lines.
%%

Content after the comment
```

**Output:**

Content before the comment

%%
This is a block comment.
%%

It can span multiple lines.

[Obsidian Official - **Comments**](https://obsidian.md/help/syntax#Comments){.readmore}

## Notes

* These plugins provide **compatibility support** and do not fully implement all of Obsidian's functionality
* Some Obsidian-specific features (such as internal link graph views, bidirectional links, etc.) are outside the scope of this support
* When embedding content, the embedded page also participates in the theme's build process
* PDF embeds require the `pdf` option in the [markdown configuration](../../config/markdown.md) to be enabled
* Video embeds require the `artPlayer` option in the [markdown configuration](../../config/markdown.md) to be enabled
* Embedded resources starting with `/` are resolved from the site root (`.vuepress/public/`), while those starting with `./` / `../` are resolved relative to the current markdown file
