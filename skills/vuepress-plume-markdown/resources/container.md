# Containers

Use `::: type [title]` to create alert boxes, collapsible details, and custom containers.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      hint: true, // Enable info, tip, warning, caution, note containers (default: true)
      alert: true, // Enable GitHub-style alerts (default: true)
    }
  })
})
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

::: details Open by default {open}
This content is visible by default.
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
