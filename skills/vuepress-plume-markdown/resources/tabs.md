# Tabs

Create tabbed content using `::: tabs`.

## Syntax

- `::: tabs[#id]`: Container.
- `@tab Title`: Tab separator.
- `@tab:active Title`: Default active tab.

## Example

````md
::: tabs
@tab npm
```sh
npm install
```

@tab:active pnpm
```sh
pnpm install
```
:::
````
