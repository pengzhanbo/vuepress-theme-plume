# npm-to

Show a single `npm` command with switchers for other package managers.

## Enable

```ts
markdown: {
  npmTo: true,
  // or limit / reorder the tabs
  npmTo: { tabs: ['npm', 'yarn', 'pnpm', 'bun', 'deno'] },
}
```

## Syntax

````md
::: npm-to
```sh
npm install vuepress
```
:::
````

With explicit tabs:

````md
::: npm-to tabs="npm,pnpm"
```sh
npm run dev
```
:::
````

## Rules

- The container must contain **exactly one** code block and nothing else.
- Supported commands: `npm install` / `i` / `add`, `npm uninstall` / `uninstall` / `remove` / `rm` / `un` /
  `unlink`, `npm run` / `run-script`, `npm init`, `npm create`, `npm ci`, `npx`.
- `npm i <pkg>` keeps flags (`-D`, `--save-dev`, `-g`) and maps them per manager.
- A command the converter does not understand is shown unchanged on every tab — verify before publishing.
