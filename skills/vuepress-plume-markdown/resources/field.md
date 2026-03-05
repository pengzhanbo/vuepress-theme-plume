# Field Container

The `::: field` container displays structured field/attribute information.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      field: true
    }
  })
})
```

## Syntax

```md
::: field-group

::: field name="propertyName" type="string" default="'default'" optional
Field description here.
:::

::: field name="anotherProp" type="number" default="0" required
Another field description.
:::

:::
```

## Example

**Input:**

```md
:::: field-group

::: field name="title" type="string" default="''" required
The title of the component.
:::

::: field name="disabled" type="boolean" default="false" optional
Whether the component is disabled.
:::

::: field name="onClick" type="(event: MouseEvent) => void" optional
Click handler callback.
:::

:::
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | Field/property name |
| `type` | Type annotation |
| `default` | Default value |
| `required` | Mark as required |
| `optional` | Mark as optional |

## Use Cases

- API documentation
- Component prop documentation
- Configuration reference
- Type definitions
