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

::: field propertyName
@type type
@default default-value
Field description here.
:::

::: field anotherProp
@type number
@default 0
@required

Another field description.
:::

:::
```

## Example

**Input:**

```md
:::: field-group

::: field title
@type `string`
@default `''`
@required

The title of the component.
:::

::: field disabled
@type `boolean`
@default `false`
Whether the component is disabled.
:::

::: field onClick
@type `(event: MouseEvent) => void`
Click handler callback.
:::

:::
```

## Field Tags

Use a markup syntax similar to JSDoc to declare field metadata.

Supports `@name`, `@type`, `@default`, `@required`, `@deprecated`, and `@description` tags.

| Tag            | Description                                                                               |
| -------------- | ----------------------------------------------------------------------------------------- |
| `@name`        | Override the field name (default uses the text following the `:::field` line as the name) |
| `@type`        | Field type annotation                                                                     |
| `@default`     | Default value                                                                             |
| `@required`    | Mark as required field                                                                    |
| `@deprecated`  | Mark as deprecated field                                                                  |
| `@description` | Explicit description text; any non-tag lines are also included in the description         |

Fields are optional by default and are only shown as required when marked with `@required`.

## Use Cases

- API documentation
- Component prop documentation
- Configuration reference
- Type definitions
