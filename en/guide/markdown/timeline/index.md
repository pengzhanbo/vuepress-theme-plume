---
url: /en/guide/markdown/timeline/index.md
---
## Overview

In markdown, use the `::: timeline` container with markdown unordered list syntax to achieve ==timeline== rendering effects.

* Supports ==horizontal== and ==vertical== orientations
* Vertical orientation supports **left alignment**, **right alignment**, and **justified alignment**
* Supports **icons** and **line styles**
* Supports setting **colors** through preset **types**, and supports custom colors

## Enable

This feature is disabled by default. You need to enable it in the `theme` configuration.

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

Inside the `::: timeline` container, use markdown unordered list syntax. Each list item represents a point on the timeline.

```md{1,9} title="timeline.md"
::: timeline Configuration
- Title
  Configuration

  Content

- Title
  Configuration

  Content
:::
```

For each list item:

* Everything from the **first line** to the **first empty line** is considered the **title**.
  The line immediately following the title is used to **configure** the behavior of the current item.

* **After the first empty line**: Content

:::important Please ensure correct indentation
:::

**A simple example:**

**Input:**

```md
::: timeline
- Node 1
  time=2025-03-20 type=success

  Content

- Node 2
  time=2025-02-21 type=warning

  Content

- Node 3
  time=2025-01-22 type=danger

  Content
:::
```

**Output:**

::: timeline

* Node 1
  time=2025-03-20 type=success

  Content

* Node 2
  time=2025-02-21 type=warning

  Content

* Node 3
  time=2025-01-22 type=danger

  Content
  :::

::: important Timeline defaults to vertical orientation
:::

## Configuration

**Timeline** supports highly flexible configuration options, divided into two main parts:

* **Container Configuration**: Configuration on the `::: timeline` container, placed after `::: timeline`. For example:

  `::: timeline horizontal` renders a horizontally oriented timeline.

* **List Item Configuration**: Configuration for each list item, placed on a separate line immediately following the title. For example:

  ```md
  ::: timeline
  - Title                          <!--Title line-->
    Also title                     <!--Title line-->
    time=2025-03-20 type=success  <!--Configuration line (optional)-->
                                  <!--Empty line (required if content exists)-->
    Content
  :::
  ```

### Container Configuration

:::: field-group

::: field name="horizontal" type="boolean" default="false" optional
Renders a horizontally oriented timeline.
:::

::: field name="card" type="boolean" default="false" optional
Renders each timeline node as a card by default (can be overridden in list item configuration).
:::

::: field name="placement" type="'left' | 'right' | 'between'" default="'left'" optional

Alignment of timeline nodes. ==Only effective in vertical orientation=={.warning}

* `left`: Left-aligns the timeline axis
* `right`: Right-aligns the timeline axis
* `between`: Justifies the timeline axis (positions defined by `placement` in list item configuration, defaults to `left`)
  :::

::: field name="line" type="'solid' | 'dashed' | 'dotted'" default="'solid'" optional
Line style (can be overridden in list item configuration).
:::

::::

### List Item Configuration

:::: field-group

::: field name="time" type="string" default="''" optional
Time point, can be any string such as `2025-03-20`, `Q1`, etc.
:::

::: field name="type" type="'info' | 'tip' | 'success' | 'warning' | 'danger' | 'caution' | 'important'" default="'info'" optional
Type of the timeline node.
:::

::: field name="card" type="boolean" default="false" optional
Renders the current timeline node as a card. Default value is inherited from container configuration `card`.
:::

::: field name="line" type="'solid' | 'dashed' | 'dotted'" default="'solid'" optional
Line style. Default value is inherited from container configuration `line`.
:::

::: field name="icon" type="string" default="''" optional
Icon for the timeline node. Supports all [iconify](https://icon-sets.iconify.design/) icons.
:::

::: field name="placement" type="'left' | 'right'" default="'left'" optional

Defines the position of the current timeline node when container configuration `placement` is `between`.

* `left`: On the left side of the timeline axis
* `right`: On the right side of the timeline axis
  :::

::: field name="color" type="string" default="''" optional
Line color for the timeline node. Can be any valid color value.
:::

::::

## Examples

### Horizontal Orientation

Add `horizontal` after `:::timeline` to render the timeline in horizontal orientation.

**Input:**

```md /horizontal/
::: timeline horizontal
- Node 1
  time=2025-03-20

  Content

- Node 2
  time=2025-04-20 type=success

  Content

- Node 3
  time=2025-01-22 type=danger

  Content

- Node 4
  time=2025-01-22 type=important

  Content
:::
```

**Output:**

::: timeline horizontal

* Node 1
  time=2025-03-20

  Content

* Node 2
  time=2025-04-20 type=success

  Content

* Node 3
  time=2025-01-22 type=danger

  Content

* Node 4
  time=2025-01-22 type=important

  Content
  :::

### Right Alignment

Add `placement="right"` after `:::timeline` to render the timeline with right alignment.

**Input:**

```md /placement="right"/
::: timeline placement="right"
- Node 1
  time=2025-03-20

  Content

- Node 2
  time=2025-04-20 type=success

  Content

- Node 3
  time=2025-01-22 type=danger

  Content

- Node 4
  time=2025-01-22 type=important

  Content
:::
```

**Output:**

::: timeline placement="right"

* Node 1
  time=2025-03-20

  Content

* Node 2
  time=2025-04-20 type=success

  Content

* Node 3
  time=2025-01-22 type=danger

  Content

* Node 4
  time=2025-01-22 type=important

  Content
  :::

### Justified Alignment

Add `placement="between"` after `:::timeline` to render the timeline with justified alignment.

List items default to the left side of the timeline. Use `placement="right"` in list item configuration to set right-side position.

**Input:**

```md /placement="between"/ /placement=right/
::: timeline placement="between"
- Node 1
  time=2025-03-20 placement=right

  Content

- Node 2
  time=2025-04-20 type=success

  Content

- Node 3
  time=2025-01-22 type=danger placement=right

  Content

- Node 4
  time=2025-01-22 type=important

  Content
:::
```

**Output:**

::: timeline placement="between"

* Node 1
  time=2025-03-20 placement=right

  Content

* Node 2
  time=2025-04-20 type=success

  Content

* Node 3
  time=2025-01-22 type=danger placement=right

  Content

* Node 4
  time=2025-01-22 type=important

  Content
  :::

### Node Types

Add `type=node-type` in list item configuration to set the node type for the current item.

**Input:**

```md /type=success/ /type=warning/ /type=danger/ /type=important/
::: timeline
- Node 1
  time=2025-03-20 type=success

  Content

- Node 2
  time=2025-04-20 type=warning

  Content

- Node 3
  time=2025-01-22 type=danger

  Content

- Node 4
  time=2025-01-22 type=important

  Content
:::
```

**Output:**

::: timeline

* Node 1
  time=2025-03-20 type=success

  Content

* Node 2
  time=2025-04-20 type=warning

  Content

* Node 3
  time=2025-01-22 type=danger

  Content

* Node 4
  time=2025-01-22 type=important

  Content
  :::

### Line Styles

* Add `line=line-style` in container configuration to set the default line style for all nodes.
* Add `line=line-style` in list item configuration to set the line style for a specific node.

**Input:**

```md /line="dotted"/ /line=solid/ /line=dashed/
::: timeline line="dotted"
- Node 1
  time=2025-03-20

  Content

- Node 2
  time=2025-04-20 type=success

  Content

- Node 3
  time=2025-01-22 type=danger line=dashed

  Content

- Node 4
  time=2025-01-22 type=important line=solid

  Content
:::
```

**Output:**

::: timeline line="dotted"

* Node 1
  time=2025-03-20

  Content

* Node 2
  time=2025-04-20 type=success

  Content

* Node 3
  time=2025-01-22 type=danger line=dashed

  Content

* Node 4
  time=2025-01-22 type=important line=solid

  Content
  :::

### Nodes with Icons

Add `icon=icon-name` in list item configuration to add an icon to the node.

Icon names support all [iconify](https://icon-sets.iconify.design/) icon names.

**Input:**

```md /icon=mdi:balloon/ /icon=mdi:bookmark/
::: timeline placement="between"
- Node 1
  time=2025-03-20 placement=right icon=mdi:balloon

  Content

- Node 2
  time=2025-04-20 type=success icon=mdi:bookmark

  Content

- Node 3
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  Content

- Node 4
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  Content
:::
```

**Output:**

::: timeline placement="between"

* Node 1
  time=2025-03-20 placement=right icon=mdi:balloon

  Content

* Node 2
  time=2025-04-20 type=success icon=mdi:bookmark

  Content

* Node 3
  time=2025-01-22 type=danger placement=right icon=mdi:bullhorn-variant-outline

  Content

* Node 4
  time=2025-01-22 type=important card=true icon="mdi:cake-variant-outline"

  Content
  :::

### Card Nodes

Card nodes can be flexibly controlled:

* Add `card` in container configuration to make every list item a card node.
* Add `card=true` in list item configuration to set the node as a card node.
* Add `card=false` in list item configuration to set the node as a non-card node.

Card node styles are affected by the `type` configuration.

::: tip Adding `card=true` / `card=false` in list item configuration can override the container's `card` configuration
:::

**Input:**

```md{1} /card=false/
::: timeline card
- Node 1
  time=2025-03-20

  Content

- Node 2
  time=2025-04-20 type=success card=false

  Content

- Node 3
  time=2025-01-22 type=danger

  Content

- Node 4
  time=2025-01-22 type=important

  Content
:::
```

**Output:**

::: timeline card

* Node 1
  time=2025-03-20

  Content

* Node 2
  time=2025-04-20 type=success card=false

  Content

* Node 3
  time=2025-01-22 type=danger

  Content

* Node 4
  time=2025-01-22 type=important

  Content
  :::

## Custom Node Types

Timeline node types are controlled through CSS Variables. The theme provides the following CSS variables:

```css
:root {
  --vp-timeline-c-line: var(--vp-c-border);   /* Line color */
  --vp-timeline-c-point: var(--vp-c-border);  /* Point color */
  --vp-timeline-c-title: var(--vp-c-text-1);  /* Title text color */
  --vp-timeline-c-text: var(--vp-c-text-1);   /* Content text color */
  --vp-timeline-c-time: var(--vp-c-text-3);   /* Time text color */
  --vp-timeline-c-icon: var(--vp-c-bg);       /* Icon color */
  --vp-timeline-bg-card: var(--vp-c-bg-soft); /* Background color for card nodes */
}
```

For example, the built-in node type `tip`:

```css /.tip/
.vp-timeline-item.tip {
  --vp-timeline-c-line: var(--vp-c-tip-1);
  --vp-timeline-c-point: var(--vp-c-tip-1);
  --vp-timeline-bg-card: var(--vp-c-tip-soft);
}
```

You can override built-in types or add new types in [Custom Styles](../custom/style.md).

**Example:**

```css title=".vuepress/styles/index.css"
.vp-timeline-item.your-type {
  --vp-timeline-c-line: #3cf;
  --vp-timeline-c-point: #3cf;
  --vp-timeline-bg-card: rgba(60, 252, 255, 0.314);
}
```

```md /type=your-type/
::: timeline
- Node 1
  time=2025-03-20

  Content

- Node 2
  time=2025-04-20 type=your-type card=true

  Content

- Node 3
  time=2025-01-22 type=danger

  Content
:::
```

::: timeline

* Node 1
  time=2025-03-20

  Content

* Node 2
  time=2025-04-20 type=your-type card=true

  Content

* Node 3
  time=2025-01-22 type=danger

  Content
  :::
