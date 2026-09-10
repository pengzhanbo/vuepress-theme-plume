---
url: /en/guide/markdown/steps/index.md
---
## Overview

When you need to present content as sequential steps, you can use the `steps` container to achieve this.

## Syntax

Within the `steps` container, use ordered lists (or unordered lists) to represent steps. You can use any Markdown syntax inside the container.

```md
::: steps

1. Step 1

  Related content

2. Step 2

  Related content

:::
```

## Examples

Input:

````md
:::: steps
1. Step 1

   ```ts
   console.log('Hello World!')
   ```

2. Step 2

   This is the related content for step 2

3. Step 3

   ::: tip
   Tip container
   :::

4. Complete
::::
````

Output:

:::: steps

1. Step 1

   ```ts
   console.log('Hello World!')
   ```

2. Step 2

   This is the related content for step 2

3. Step 3

   ::: tip
   Tip container
   :::

4. Complete
   ::::
