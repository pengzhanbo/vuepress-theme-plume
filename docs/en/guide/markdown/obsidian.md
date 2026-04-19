---
title: Obsidian Compatibility
icon: simple-icons:obsidian
createTime: 2026/04/17 21:56:55
permalink: /en/guide/markdown/obsidian/
---

## Overview

The theme provides compatibility support for Obsidian's official Markdown extension syntax through the `vuepress-plugin-md-power` plugin, enabling Obsidian users to write documentation using familiar syntax.

Currently supported Obsidian extension syntax includes:

- [Wiki Links](#wiki-links) - Syntax for inter-page linking
- [Embeds](#embeds) - Embed content from other files into the current page
- [Comments](#comments) - Add comments visible only during editing

::: warning No plans to support extension syntax provided by Obsidian's third-party community plugins
:::

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

- **Relative paths** (starting with `.`): Resolved relative to the current file's directory
- **Absolute paths** (not starting with `.`): Searched throughout the document tree, prioritizing the shortest path
- **Directory form** (ending with `/`): Matches `README.md` in that directory

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
| `[[../]]`          | Matches `docs/guide/README.md` (parent directory)                                        |
| `[[guide/]]`      | Matches `docs/guide/README.md` (directory form)                                          |

### Examples

**External Links:**

**Input:**

```md
[[https://example.com|External Link]]
```

**Output:**

[[https://example.com|External Link]]

**Internal Anchor Links:**

**Input:**

```md
[[npm-to]]  <!-- Search by filename -->
[[guide/markdown/math]]  <!-- Search by file path -->
[[#Wiki Links]]  <!-- Heading on current page -->
[[file-tree#Configuration]]  <!-- Search by filename, link to heading -->
```

**Output:**

[[npm-to]]

[[guide/markdown/math]]

[[#Wiki Links]]

[[file-tree#Configuration]]

[Obsidian Official - **Wiki Links**](https://obsidian.md/en/help/links){.readmore}

## Embeds

The embed syntax allows you to insert other file resources into the current page.

### Syntax

```md
![[filename]]
![[filename#heading]]
![[filename#heading#subheading]]
```

Filename search rules are the same as [Wiki Links](#filename-search-rules).

::: info Resources starting with `/` or having no path prefix like `./` are loaded from the `public` directory
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

> [!NOTE]
> PDF embeds require the `markdown.pdf` plugin to be enabled for proper functionality.

**Syntax:**

```md
![[document.pdf]]
![[document.pdf#page=1]]  <!-- #page=1 means first page -->
![[document.pdf#page=1#height=300]]  <!-- #page=page number #height=height -->
```

Supported formats: `pdf`

---

### Audio Embeds

**Syntax:**

```md
![[audio file]]
```

Supported formats: `mp3`, `flac`, `wav`, `ogg`, `opus`, `webm`, `acc`

---

### Video Embeds

> [!NOTE]
> Video embeds require the `markdown.artPlayer` plugin to be enabled for proper functionality.

**Syntax:**

```md
![[video file]]
![[video file#height=400]]  <!-- Set video height -->
```

Supported formats: `mp4`, `webm`, `mov`, etc.

---

### Content Fragment Embeds

Content fragments under a specified heading can be embedded using `#heading`:

**Input:**

```md
![[my-note]]
![[my-note#Heading One]]
![[my-note#Heading One#Subheading]]
```

[Obsidian Official - **Insert Files**](https://obsidian.md/en/help/embeds){.readmore}
[Obsidian Official - **File Formats**](https://obsidian.md/en/help/file-formats){.readmore}

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

---

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

[Obsidian Official - **Comments**](https://obsidian.md/en/help/syntax#%E6%B3%A8%E9%87%8B){.readmore}

## Configuration

Obsidian compatibility features are all enabled by default. You can selectively enable or disable them through configuration:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      mdPower: {
        obsidian: {
          wikiLink: true,    // Wiki Links
          embedLink: true,  // Embeds
          comment: true,    // Comments
        },
        pdf: true,          // PDF embed functionality
        artPlayer: true,    // Video embed functionality
      }
    }
  })
})
```

### Configuration Options

:::: field-group

::: field name="wikiLink" type="boolean" default="true" optional
Enable Wiki Links syntax.
:::

::: field name="embedLink" type="boolean" default="true" optional
Enable embed content syntax.
:::

::: field name="comment" type="boolean" default="true" optional
Enable comment syntax.
:::

::::

## Notes

- These plugins provide **compatibility support** and do not fully implement all of Obsidian's functionality
- Some Obsidian-specific features (such as internal link graph views, bidirectional links, etc.) are outside the scope of this support
- When embedding content, the embedded page also participates in the theme's build process
- PDF embeds require the `markdown.pdf` plugin to be enabled simultaneously
- Video embeds require the `markdown.artPlayer` plugin to be enabled simultaneously
- Embed resources starting with `/` or using `./` form are loaded from the `public` directory
