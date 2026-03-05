# Demo Wrapper

The `::: demo` container wraps content with a demo preview and code display.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      demo: true
    }
  })
})
```

## Syntax

````md
::: demo [Title]

```html
<!-- Your HTML/Vue code here -->
<div class="example">Demo content</div>
```

:::
````

## Example

**Input:**

`````md
::: demo Button Example

```html
<button class="btn">Click me</button>

<style>
.btn {
  padding: 8px 16px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

:::
`````

**Output:**

Displays both the rendered button and the source code with syntax highlighting.

## Features

- Live preview of HTML/Vue components
- Syntax highlighted source code
- Collapsible code section
- Supports `<style>` and `<script>` tags

## Use Cases

- Component documentation
- UI pattern examples
- Interactive tutorials
- Design system showcases
