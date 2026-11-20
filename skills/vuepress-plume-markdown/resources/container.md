# Containers

Use `::: type [title]` to create alert boxes, collapsible details, and custom containers.

## Enable

Both are on by default — no config needed.

```ts
markdown: {
  hint: true,  // default
  alert: true, // default; rendered by the obsidian callout renderer while `markdown.obsidian` is enabled
}
```

## Supported Types

### Alert Containers

- `note` - Neutral information
- `info` - General information (blue)
- `tip` - Helpful advice (green)
- `warning` - Caution needed (yellow/orange)
- `caution` / `danger` - Critical warning (red)
- `important` - Important information (purple)

### Collapsible Container

- `details` - Collapsible content block

## Syntax

```md
::: type [Optional Title]
Content here
:::
```

## Examples

### Basic Alerts

```md
::: note
This is a note with default title.
:::

::: info
This is an info box.
:::

::: tip
This is a tip with default title.
:::

::: tip Custom Title
This tip has a custom title.
:::

::: warning
Be careful with this step.
:::

::: caution STOP!
This action is irreversible.
:::
```

### Collapsible Details

```md
::: details Click to expand
This content is hidden by default.

- Can contain
- Any markdown
- Content
:::

::: details 自定义标题
标题可省略，省略时使用当前语言的默认文案。
:::
```

### GitHub-Style Alerts

```md
> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for better results.

> [!IMPORTANT]
> Key information users need to know.

> [!WARNING]
> Urgent info that needs immediate attention.

> [!CAUTION]
> Advises about risks or negative outcomes.
```

## Alignment

Always available (`left` / `center` / `right` / `justify`):

```md
::: center
居中的内容
:::

::: justify
两端对齐的长段落……
:::
```

## Nested Containers

Containers can be nested:

```md
::: tip Outer Container
Some content

::: warning Inner Container
Nested warning inside tip
:::

More outer content
:::
```

## Code Inside Containers

````md
::: tip Example Code

```ts
const example = 'code blocks work inside containers'
```

:::
````

## Styling

Containers use theme colors and support:

- Custom icons (based on type)
- Dark/light mode adaptation
- Consistent spacing and borders
