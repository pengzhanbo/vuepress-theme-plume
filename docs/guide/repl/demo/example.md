这是一个用于演示 `@[demo markdown]` 语法的示例文件。

它支持 **Markdown 语法**：

- 列表
- 代码块
- 引用

```js
const a = 1
console.log(a)
```

> 这是一个引用块。

表格同样支持：

| 名称 | 说明 |
| --- | --- |
| `demo` | 演示容器 |
| `markdown` | 演示内容类型 |

::: warning 本文件不会生成页面
本文件位于 `docs/guide/repl/demo/` 目录，已在 `.vuepress/config.ts` 的 `pagePatterns` 中排除，仅作为 `@[demo markdown]` 的演示素材。
:::
