---
title: Steps
createTime: 2025/03/24 20:10:59
icon: streamline:steps-number
permalink: /en/guide/markdown/steps/
---

## Overview

Sometimes, you need to display content in progressive steps. You can achieve this using the `steps` container.

## Syntax

Within the `steps` container, use ordered (or unordered) lists to represent steps. You can use any Markdown syntax inside the container.

````md
::: steps

1. Step 1

  Related content

2. Step 2

  Related content

:::
````

## Example

Input:

````md
:::: steps
1. Step 1

   ```ts
   console.log('Hello World!')
   ```

2. Step 2

   Here is the content related to step 2

3. Step 3

   ::: tip
   Hint container
   :::

4. End
::::
````

Output:

:::: steps

1. Step 1

   ```ts
   console.log('Hello World!')
   ```

2. Step 2

   Here is the content related to step 2

3. Step 3

   ::: tip
   Hint container
   :::

4. End
   ::::
