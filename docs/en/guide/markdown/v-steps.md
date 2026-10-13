---
title: Steps
icon: streamline:steps-number
createTime: 2025/10/08 14:40:30
permalink: /en/guide/markdown/steps/
---

## Overview

When you need to present content as sequential steps, you can use the `steps` container to achieve this.

## Syntax

Within the `steps` container, use ordered lists (or unordered lists) to represent steps. You can use any Markdown syntax inside the container.

::: tip More outer colons are required when nesting other containers
The closing marker of a container does not validate the container name; it only checks whether the number of
leading colons is not less than the opening count. Therefore, when step content needs to nest a container such
as `::: tip`, the outer container must be written as `:::: steps`, otherwise the inner container's closing
marker will close the outer container prematurely.
:::

````md
::: steps

1. Step 1

  Related content

2. Step 2

  Related content

:::
````

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
