---
url: /en/guide/code/import/index.md
---
## Overview

Importing code allows you to include code from another file in your markdown file and have it highlighted.

It helps you reference code from other files in your articles, avoiding duplicate code writing.

## Syntax

You can use the following syntax to import code blocks from files:

**Input:**

```md
@[code](../snippet/snippet-1.js)
```

**Output:**

@[code](../../../snippet/snippet-1.js)

If you only want to import a specific portion of the file:

```md
<!-- Import only lines 1 to 10 -->
@[code{1-10}](../snippet/snippet-1.js)
```

The code language is inferred from the file extension, but we recommend explicitly specifying it:

```md
<!-- Specify code language -->
@[code js](../snippet/snippet-1.js)

<!-- Line highlighting -->
@[code js{2,4-5}](../foo.js)
```
