# Steps

Display sequential steps using `::: steps`.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      steps: true
    }
  })
})
```

## Syntax

```md
::: steps

1. Step Title
   Step description content.
   Can be multi-line.

2. Another Step
   More content here.

3. Final Step
   Last step content.

:::
```

## Examples

### Basic Steps

````md
::: steps

1. Install
   Install the package using your preferred package manager.
   ```bash
   npm install package
   ```

2. Configure
   Add configuration to your config file.
   ```ts
   export default { /* config */ }
   ```

3. Run
   Start the development server.
   ```bash
   npm run dev
   ```

:::
````

### Without Numbers

```md
::: steps

- First Step
  Content for first step.

- Second Step
  Content for second step.

:::
```

## Features

- Numbered steps with visual connector
- Supports rich content (code, lists, etc.)
- Responsive design
- Dark/light mode support
- Customizable styling via CSS variables

## Styling

Steps use these CSS variables:

```css
:root {
  --vp-steps-bg-color: var(--vp-c-bg);
  --vp-steps-border-color: var(--vp-c-divider);
  --vp-steps-number-bg: var(--vp-c-brand);
  --vp-steps-number-color: var(--vp-c-white);
}
```
