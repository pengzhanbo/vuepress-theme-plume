---
title: Timeline
icon: mdi:timeline-text-outline
createTime: 2025/03/24 21:19:12
permalink: /en/guide/markdown/timeline/
badge:
  text: 1.0.0-rc.137 +
  type: tip
---

## Overview

In markdown, using the `::: timeline` container with markdown unordered list syntax achieves a ==timeline== rendering effect.

- Supports ==horizontal== and ==vertical== directions
- Vertical direction supports **left alignment**, **right alignment**, and **both ends alignment**
- Supports **icons** and **line styles**
- Supports preset **types** to set **colors** and custom colors

## Enablement

This feature is not enabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      timeline: true, // [!code ++]
    }
  })
})
```

## Usage

In the `::: timeline` container, use markdown unordered list syntax, with each list item being a point on the timeline.

```md{1,9} title="timeline.md"
::: timeline Configuration
- Title
  Configuration

  Body content

- Title
  Configuration

  Body content
:::
```

For each list item:

- From **the first line** to **the first blank line**, it is the **title**, with the line following the title used to **configure** the item's behavior
- **After the first blank line**: body content

:::important Please note to add the correct indentation
:::

_A simple example:_

_Input:_

```md
::: timeline
- Node one
  time=2025-03-20 type=success

  Body content

- Node two
  time=2025-02-21 type=warning

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content
:::
```

_Output:_

::: timeline

- Node one
  time=2025-03-20 type=success

  Body content

- Node two
  time=2025-02-21 type=warning

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content
  :::

::: important The timeline defaults to vertical direction
:::

## Configuration

The **timeline** supports flexible configuration options, divided into two main parts:

- **Container configuration**: Configurations on the `::: timeline` container, following `::: timeline` like `::: timeline horizontal` for horizontal timeline rendering.
- **List item configuration**: Configurations for each list item, following the title line like:
  ```md
  ::: timeline
  - Title                          <!--Title line-->
    Also title                      <!--Title line-->
    time=2025-03-20 type=success  <!--Configuration line, optional-->
                                  <!--Blank line, required if there's body content-->
    Body content
  :::
  ```

### Container Configuration

#### horizontal

- **Type**: `boolean`
- **Default**: `false`

Renders the timeline horizontally.

#### card

- **Type**: `boolean`
- **Default**: `false`

Renders each timeline node as a card style (can be overridden in list item configuration).

#### placement

- **Type**: `'left' | 'right' | 'between'`
- **Default**: `'left'`

Alignment of timeline nodes ==only effective in vertical direction=={.warning}.

- `left`: Aligns timeline to the left
- `right`: Aligns timeline to the right
- `between`: Aligns timeline to both ends (define position via `placement` in list item configuration, default is `left`)

#### line

- **Type**: `'solid' | 'dashed' | 'dotted'`
- **Default**: `'solid'`

Line style (can be overridden in list item configuration).

### List Item Configuration

#### time

- **Type**: `string`
- **Default**: `''`

Time point, can be any string like `2025-03-20` or `Q1`.

#### type

- **Type**: `'info' | 'tip' | 'success' | 'warning' | 'danger' | 'caution' | 'important'`
- **Default**: `'info'`

Type of timeline node.

#### card

- **Type**: `boolean`
- **Default**: `false` (inherits from container configuration)

Renders the current node as a card style.

#### line

- **Type**: `'solid' | 'dashed' | 'dotted'`
- **Default**: `'solid'` (inherits from container configuration)

Line style.

#### icon

- **Type**: `string`
- **Default**: `''`

Icon for the timeline node, supports all [iconify](https://icon-sets.iconify.design/) icons.

#### placement

- **Type**: `'left' | 'right'`
- **Default**: `'left'`

Position of the node when container is set to `between`.

- `left`: On the left side of the timeline
- `right`: On the right side of the timeline

#### color

- **Type**: `string`
- **Default**: `''`

Color for the timeline node line, can be any valid color value.

## Examples

### Horizontal Direction

Add `horizontal` after `:::timeline` to render the timeline horizontally.

Input:

```md /horizontal/
::: timeline horizontal
- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
:::
```

Output:

::: timeline horizontal

- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
  :::

### Right Alignment

Add `placement="right"` after `:::timeline` to render the timeline right-aligned.

Input:

```md /placement="right"/
::: timeline placement="right"
- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
:::
```

Output:

::: timeline placement="right"

- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
  :::

### Both Ends Alignment

Add `placement="between"` after `:::timeline` to render the timeline aligned to both ends.

List items default to the left side of the timeline, use `placement="right"` in list item configuration to set the position to the right.

Input:

```md /placement="between"/ /placement=right/
::: timeline placement="between"
- Node one
  time=2025-03-20 placement=right

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger placement=right

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
:::
```

Output:

::: timeline placement="between"

- Node one
  time=2025-03-20 placement=right

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger placement=right

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
  :::

### Node Types

Add `type=node type` in list item configuration to set the node type.

Input:

```md /type=success/ /type=warning/ /type=danger/ /type=important/
::: timeline
- Node one
  time=2025-03-20 type=success

  Body content

- Node two
  time=2025-04-20 type=warning

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
:::
```

Output:

::: timeline

- Node one
  time=2025-03-20 type=success

  Body content

- Node two
  time=2025-04-20 type=warning

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
  :::

### Line Styles

- Add `line=line style` in container configuration to set the default line style for all nodes.
- Add `line=line style` in list item configuration to set the line style for individual nodes.

Input:

```md /line="dotted"/ /line=solid/ /line=dashed/
::: timeline line="dotted"
- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger line=dashed

  Body content

- Node four
  time=2025-01-22 type=important line=solid

  Body content
:::
```

Output:

::: timeline line="dotted"

- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success

  Body content

- Node three
  time=2025-01-22 type=danger line=dashed

  Body content

- Node four
  time=2025-01-22 type=important line=solid

  Body content
  :::

### Nodes with Icons

Add `icon=icon name` in list item configuration to add icons to nodes.

Icon names support [iconify](https://icon-sets.iconify.design/) icon names.

Input:

```md /icon=mdi:balloon/ /icon=mdi:bookmark/
::: timeline placement="between"
- Node one
  time=2025-03-20 placement=right icon=mdi:balloon

  Body content

- Node two
  time=2025-04-20 type=success icon=mdi:bookmark

  Body content

- Node three
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  Body content

- Node four
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  Body content
:::
```

Output:

::: timeline placement="between"

- Node one
  time=2025-03-20 placement=right icon=mdi:balloon

  Body content

- Node two
  time=2025-04-20 type=success icon=mdi:bookmark

  Body content

- Node three
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  Body content

- Node four
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  Body content
  :::

### Card Nodes

Card nodes can be flexibly controlled:

- Add `card` in container configuration to make each list item a card node.
- Add `card=true` in list item configuration to set the node as a card node.
- Add `card=false` in list item configuration to set the node as a non-card node.

The style of card nodes is affected by the `type` configuration.

::: tip Adding `card=true` / `card=false` in list item configuration overrides the container's `card` configuration
:::

Input:

```md{1} /card=false/
::: timeline card
- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success card=false

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
:::
```

Output:

::: timeline card

- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=success card=false

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content

- Node four
  time=2025-01-22 type=important

  Body content
  :::

## Custom Node Types

Timeline node types are controlled via CSS Variables. The theme provides the following CSS variables:

```css
:root {
  --vp-timeline-c-line: var(--vp-c-border);   /* Line color */
  --vp-timeline-c-point: var(--vp-c-border);  /* Point color */
  --vp-timeline-c-title: var(--vp-c-text-1);  /* Title text color */
  --vp-timeline-c-text: var(--vp-c-text-1);   /* Body text color */
  --vp-timeline-c-time: var(--vp-c-text-3);   /* Time text color */
  --vp-timeline-c-icon: var(--vp-c-bg);       /* Icon color */
  --vp-timeline-bg-card: var(--vp-c-bg-soft); /* Card node background color */
}
```

For example, the theme's built-in node type `tip`:

```css /.tip/
.vp-timeline-item.tip {
  --vp-timeline-c-line: var(--vp-c-tip-1);
  --vp-timeline-c-point: var(--vp-c-tip-1);
  --vp-timeline-bg-card: var(--vp-c-tip-soft);
}
```

You can override built-in types or add new ones in [custom styles](../custom/style.md).

Example:

```css title=".vuepress/styles/index.css"
.vp-timeline-item.your-type {
  --vp-timeline-c-line: #3cf;
  --vp-timeline-c-point: #3cf;
  --vp-timeline-bg-card: rgba(60, 252, 255, 0.314);
}
```

```md /type=your-type/
::: timeline
- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=your-type card=true

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content
:::
```

::: timeline

- Node one
  time=2025-03-20

  Body content

- Node two
  time=2025-04-20 type=your-type card=true

  Body content

- Node three
  time=2025-01-22 type=danger

  Body content
  :::

<style>
.vp-timeline-item.your-type {
  --vp-timeline-c-line: #3cf;
  --vp-timeline-c-point: #3cf;
  --vp-timeline-bg-card: rgba(60, 252, 255, 0.314);
}
</style>
