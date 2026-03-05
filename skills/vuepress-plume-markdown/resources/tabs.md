# Tabs

Create tabbed content using `::: tabs`.

## Configuration

Enable in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      tabs: true, // General tabs
      codeTabs: true, // Code block tabs
    }
  })
})
```

## Syntax

```md
::: tabs [id]

@tab Tab Title 1
Content for tab 1

@tab:active Tab Title 2
Content for tab 2 (active by default)

@tab Tab Title 3
Content for tab 3

:::
```

## Parameters

- `id` - Optional unique identifier for the tabs group
- `@tab` - Tab separator with title
- `@tab:active` - Sets this tab as active by default

## Examples

### Basic Tabs

````md
::: tabs

@tab npm
```bash
npm install package
```

@tab yarn
```bash
yarn add package
```

@tab pnpm
```bash
pnpm add package
```

:::
````

### With Active Tab

```md
::: tabs

@tab npm
npm install

@tab:active pnpm
pnpm install

@tab yarn
yarn install

:::
```

### Code Tabs

Special syntax for code blocks:

````md
::: code-tabs

@tab TypeScript
```ts
const x: number = 1
```

@tab JavaScript
```js
const x = 1
```

:::
````

### With ID (Synced Tabs)

Tabs with the same ID will sync their active state:

```md
::: tabs#install

@tab npm
npm install

@tab pnpm
pnpm install

:::

Some other content...

::: tabs#install

@tab npm
npm run dev

@tab pnpm
pnpm dev

:::
```

## Features

- Persistent active tab (saved to localStorage)
- Synchronized tabs with same ID
- Smooth transitions
- Responsive design
- Dark/light mode support
