---
url: /en/guide/markdown/tabs/index.md
---
## Overview

Add support for tabs in Markdown.

## Syntax

You need to wrap tabs in a `tabs` container.

You can add an id suffix to the `tabs` container, which will be used as the tab id.
All tabs with the same id will share the same toggle event.

```md
::: tabs#fruit

<!-- Here, 'fruit' will be used as the id. This is optional. -->

<!-- Tab content -->

:::
```

Inside this container, you should use the `@tab` marker to label and separate tab content.

After the `@tab` marker, you can add the text `:active` to make a tab active by default. The text following this will be parsed as the tab title.

```md
::: tabs

@tab Title 1

<!-- Tab 1 content -->

@tab Title 2

<!-- Tab 2 content -->

@tab:active Title 3

<!-- Tab 3 will be active by default -->

<!-- Tab 3 content -->

:::
```

By default, the title is used as the value of the tab, but you can override this using an id suffix.

```md
::: tabs

@tab Title 1

<!-- Here, the title "Title 1" of Tab 1 will be used as its value. -->

<!-- Tab 1 content -->

@tab Title 2#value2

<!-- Here, the title of Tab 2 will be "Title 2", but it will use "value2" as the tab's value -->

<!-- Tab 2 content -->

:::
```

You can use Vue syntax and components within each tab, and you have access to `value` and `isActive`,
which represent the bound value of the tab and whether the tab is currently active.

## Example

**Input:**

````
::: tabs
@tab npm

npm should be installed alongside Node.js.

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

npm should be installed alongside Node.js.

@tab pnpm

```sh
corepack enable
corepack use pnpm@8
```

:::
