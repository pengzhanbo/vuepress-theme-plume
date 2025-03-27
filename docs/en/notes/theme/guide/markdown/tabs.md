---
title: Tabs
createTime: 2025/03/24 21:13:58
icon: vaadin:tabs
permalink: /en/guide/markdown/tabs/
---

## Overview

Markdown supports tabs functionality.

## Syntax

You need to wrap the tabs in a `tabs` container.

You can add an id suffix to the `tabs` container, which will be used as the tab id.
All tabs with the same id will share the same toggle event.

```md
::: tabs#fruit

<!-- Here, fruit will be used as the id, it is optional -->

<!-- Tab content -->

:::
```

Within this container, you should use the `@tab` tag to mark and separate the tab content.

After the `@tab` tag, you can add the text `:active` to default activate the tab, and the subsequent text will be parsed as the tab title.

```md
::: tabs

@tab Title 1

<!-- Tab 1 content -->

@tab Title 2

<!-- Tab 2 content -->

@tab:active Title 3

<!-- Tab 3 will be default activated -->

<!-- Tab 3 content -->

:::
```

By default, the title will be used as the tab's value, but you can override it with an id suffix.

```md
::: tabs

@tab Title 1

<!-- Here, the tab 1's title "Title 1" will be used as the value. -->

<!-- Tab 1 content -->

@tab Title 2#Value 2

<!-- Here, the tab 2's title will be "Title 2", but it will use "Value 2" as the tab's value -->

<!-- Tab 2 content -->

:::
```

You can use Vue syntax and components within each tab, and you can access value and isActive,
which represent the tab's bound value and whether the tab is active.

## Example

**Input:**

````
::: tabs
@tab npm

npm should be installed together with Node.js.

@tab pnpm

```sh
corepack enable
corepack use pnpm@8
```

:::
````

**Output:**

::: tabs
@tab npm

npm should be installed together with Node.js.

@tab pnpm

```sh
corepack enable
corepack use pnpm@8
```

:::
