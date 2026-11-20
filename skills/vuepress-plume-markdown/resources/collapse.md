# Collapse

## Enable

```ts
markdown: { collapse: true }
```

## Syntax

```md
::: collapse [accordion] [expand]
- 标题 1

  内容 1

- 标题 2

  内容 2
:::
```

| Option | Effect |
| --- | --- |
| `accordion` | only one panel open at a time |
| `expand` | all panels open by default |
| `:+ 标题` | this panel open by default |
| `:- 标题` | this panel closed by default |

Rules:

- A **blank line** is required between the item title and its body, and the body must be indented.
- With `expand`, `:-` forces a panel closed; with `accordion` + `expand`, only the first panel opens and a `:+`
  marker wins over the `expand` default.

## Example

````markdown
::: collapse accordion expand
- 安装

  ```sh
  pnpm add -D vuepress@next vuepress-theme-plume
  ```

- :- 常见问题

  内容默认折叠
:::
````
