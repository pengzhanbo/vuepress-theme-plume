# Steps

Available by default — there is **no** `markdown.steps` option.

````markdown
::: steps

1. 安装

   安装依赖：

   ```sh
   pnpm add -D vuepress@next vuepress-theme-plume
   ```

2. 配置

   创建 `.vuepress/config.ts`。

3. 启动

   ```sh
   pnpm vuepress dev
   ```

:::
````

- Ordered lists render numbered markers; an unordered list (`- item`) also works and keeps a step layout.
- Leave a **blank line** after the item title before its body, and indent the body to align with the title text.
- The container body is full markdown: code blocks, images, other containers.
- Nesting another container inside `::: steps` requires the outer marker to use 4+ colons:

````md
:::: steps

1. 说明

   ::: tip
   提示内容
   :::

::::
````

- Empty marker (`::: steps`) is enough; no positional arguments are supported.
