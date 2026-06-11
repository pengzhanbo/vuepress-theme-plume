---
url: /guide/chart/markmap/index.md
---
## 概述

主题支持在 文章中 嵌入由 [markmap](https://markmap.js.org/) 。

该功能由 [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/) 提供支持。

## 配置

主题默认不启用该功能。

你需要在你的项目中安装 `markmap-lib`, `markmap-toolbar` and `markmap-view`:

::: npm-to

```sh
npm i markmap-lib markmap-toolbar markmap-view
```

:::

然后在 `.vuepress/config.ts` 配置文件中，启用该功能：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      markmap: true, // [!code ++]
    },
  })
})
```

::: note
以下文档 Fork 自 [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/markmap.html),
遵循 [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE) 许可证。
:::

## 语法

````md
```markmap
<!-- 在这里放置内容 -->
```
````

支持通过 Frontmatter 语法进行配置。

## 案例

::: demo markdown title="markmap"

`````md
````markmap
---
markmap:
  colorFreezeLevel: 2
---

# markmap

## 链接

- <https://markmap.js.org/>
- [GitHub](https://github.com/markmap/markmap)

## 功能

- 链接
- **强调** ~~删除线~~ *斜体* ==高亮==
- 多行
  文字
- `行内代码`
-
    ```js
    console.log('code block');
    ```
- Katex
  - $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$
- 现在我们可以通过 `maxWidth` 选项自动换行非常非常非常非常非常非常非常非常非常非常长的内容
````
`````

:::
