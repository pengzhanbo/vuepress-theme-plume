---
url: /en/guide/components/link-card/index.md
---
## Overview

Use the `<LinkCard>` component to display link cards on pages.

## Props

:::: field-group

::: field name="title" type="string" default="''" optional
Link card title.
:::

::: field name="icon" type="string | { svg: string }" default="''" optional
Icon displayed to the left of the title. Supports icons from providers configured in
[markdown.icon](../features/icon.md), or image URLs can be used.
:::

::: field name="href" type="string" default="''" optional
Link card navigation URL.
:::

::: field name="description" type="string" default="''" optional
Link card description. It is recommended to use the component's default slot for description content.
:::

::: field name="target" type="string" default="''" optional
Link target behavior.
:::

::::

## Slots

| Name    | Description          |
|---------|----------------------|
| default | Card detail content  |
| title   | Custom title content |

## Examples

**Input:**

```md :no-line-numbers
<LinkCard title="Title" href="/" description="Card content" />
<LinkCard icon="twemoji:astonished-face" title="Title" href="/" />
```

**Output:**

Using component slots enables richer presentations.

**Input:**

```md :no-line-numbers
<LinkCard title="Title" href="/">

  - Card content
  - Card content

</LinkCard>

<LinkCard href="/">
  <template #title>
    <span style="color: red" >Title</span>
  </template>

  - Card content
  - Card content

</LinkCard>
```

**Output:**

* Card content
* Card content

- Card content
- Card content

:::info
Markdown syntax can also be used within slots, but note that there must be a blank line between the
markdown syntax and the tags. Otherwise, it will be parsed as plain text.
:::
