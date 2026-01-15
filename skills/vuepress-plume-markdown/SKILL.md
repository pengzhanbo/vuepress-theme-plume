---
name: vuepress-plume-markdown
description: Create and edit Markdown documents, including basic Markdown syntax and the enhanced Markdown syntax of vuepress-theme-plume. Use when handling .md files.
---

# VuePress Plume Flavored Markdown Skill

This skill enables Claude Code to create and edit valid VuePress Plume Flavored Markdown,
including all plume-specific syntax extensions. In addition, all basic markdown syntax is usable.

## Overview

VuePress Plume uses a combination of Markdown flavors:

- Basic markdown syntax
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [LaTeX](https://www.latex-project.org/) for math
- Plume-specific syntax extensions (various containers, assets embedding, code demos, etc.)

## Linting

- The maximum character length per line should not exceed 120
- Inline markup syntax should have a space before and after
- Block-level markup syntax should have a blank line before and after

## Basic Formatting

### Paragraphs and Line Breaks

```markdown
This is a paragraph.

This is another paragraph (blank line between creates separate paragraphs).

For a line break within a paragraph, add two spaces at the end
or use Shift+Enter.
```

### Escaping Formatting

Use backslash to escape special characters:

```markdown
\*This won't be italic\*
\#This won't be a heading
1\. This won't be a list item
```

Common characters to escape: `\*`, `\_`, `\#`, `` \` ``, `\|`, `\~`

## Attrs

Use `{ }` after Markdown statement to add classnames, identifiers, or html attributes.

```markdown
markdown statement{.classname #id attr1=value attr2="value with spaces"}
```

```markdown
__bold__{.bolder}
==mark=={#markId data-mark-mode="lazy"}
## heading {#anchor}
```

## Markers

```markdown
==normal==
==a note=={.note}
==a caution=={.info}
==a tip=={.tip}
==a warning=={.warning}
==an error=={.danger}
==important content=={.important}
```

## Containers

Containers are wrapped using `:::`, supporting nested containers, where the outer container should have more `:` than the inner one.

```markdown
::: [name] [attrs]
content
:::
```

- `[name]`: the name of the container
- `[attrs]`: the attributes of the container, use `key="value"`, separated by spaces

```markdown
::: steps title="steps title"
content
:::
```

Nested containers:

```markdown
:::: note
note content

::: info
info content
:::

other note content
::::
```

### Hint Container

Use when content needs to be highlighted.

```markdown
::: info [title]
content
:::
```

`[title]` is optional, it is not necessary to use `title="title"` to specify the title.
support `tip`, `note`, `info`, `warning`, `caution`, `important` containers.

## Code Tabs Container

````markdown
::: code-tabs
@tab:active title1
```html
<!-- html code -->
```
@tab title2
```js
// js code
```
:::
````

### Steps Container

Use when content needs to be presented in a progressive manner.

Use unordered lists or ordered lists in containers to represent steps. Supports optional `title` attrs

```markdown
::: steps title="steps title"
- Step 1
  content
- Step 2
  content
- Step 3
  content
:::
```

### File-Tree Container

use unordered list syntax to specify the organizational structure of files and directories.
Use nested list items to create subdirectories.
If you want a directory not to display specific content, add `/` at the end of the list item.

- Emphasize file or directory names by making them bold, e.g., **README.md**
- Add comments to files or directories by adding additional text after the name
- Mark files or directories as added or deleted by prefixing the name with `++` or `--`
- Use `...` or `…` as the name to add placeholder files and directories.

```markdown
::: file-tree title="file-tree-title"
- folder1
  - file1.md
- folder2
  - nested-folder  # comment
    - …
  - **highlighted-file.md**
- folder4/
- ++ file4.md
- -- file5.md
:::
```

### Code-Tree Container

Compared to code tabs container, the code tree can more clearly display the organizational structure of code files and their dependencies.

code block `title="filepath"` is required, indicate the file path of the code block

````markdown
::: code-tree title="code-tree-title"
```ts title="src/index.ts"
// ts code
```
```ts title="src/components/HelloWorld.ts"
// ts code
```
```json title="package.json"
{}
```
:::
````

### Field Container

Used to describe field information, including field name, field type, whether it is required, default value, details, and other information.

It is suitable for scenarios such as describing fields in configurations, component Props, and more.

```markdown
:::: field-group
::: field1 name="name" type="string" required default="''"
description
:::
::: field2 name="age" type="number" optional default="0"
description
:::
::::
```

### Collapse Container

containing unordered list syntax, with each item as a separate collapsible area.
Support optional accordion mode via `accordion`.

```markdown
::: collapse accordion
- title 1   <!-- Title, click to control expand/collapse -->
            <!-- There must be a blank line between the title and the content -->
  content   <!-- Content, collapsed area -->

- title 2

  content
:::
```

### npm-to Container

Converts npm command-line code blocks into `pnpm / yarn / deno / bun` command-line code blocks, presenting them as a group of code blocks.

````markdown
::: npm-to
``` sh
npm install -D vuepress
```
:::
````

## Embedded

### PDF

```markdown
@[pdf](/asset/pdf_path.pdf)
@[pdf](https://example.com/example.pdf)
```

When opening a specific page, follow the `pdf` with a page number.

```markdown
@[pdf 2](pdf_path.pdf)
```

More options can be added to `@[pdf ]`

```markdown
@[pdf 2 width="100%" height="600px" zoom="1" ratio="16:9"](pdf_path.pdf)
```

`ratio` Aspect ratio, default is `16:9`, only takes effect when `height` is not specified.
