---
url: /snippet/index.md
---
## snippet 片段目录

本目录存放供 `@include` / `@[code]` 引用的**内容片段**，用于在多个页面之间复用同一份示例内容。

## 命名与约定

* **不单独成页**：`*.snippet.md` 片段不会出现在侧边栏或导航中，也不参与 lunaria 翻译流程
  （`docs/lunaria.config.ts` 的 `files.include` 仅覆盖 `{config,guide,tools}/**/*.md`）。
* **不参与 markdownlint**：`.markdownlintignore` 已排除 `**/*.snippet.md`。
* **命名**：`<用途>-<序号>.snippet.md`，序号从 `1` 开始，通常与引用页中的出现顺序一致；
  没有多个变体的通用片段直接使用用途名，如 `code-block.snippet.md`、`whitespace.snippet.md`。
* **路径解析**：片段内的相对链接与 `@include` 路径都**相对于片段所在目录**（即本目录）解析，
  因此从 `docs/guide/chart/` 引用时需要写成 `../../snippet/xxx.snippet.md`。
* **行范围**：`@include` 支持 `{17-23}` 这类行范围，详见
  [Markdown Include 配置](../config/plugins/markdown-include.md)。

## 维护须知

片段被多处引用，**重命名或删除前请先全局搜索**：

```sh
rg 'snippet/|@include:' docs
```

修改片段内容会同时影响所有引用页，请一并确认这些页面仍然正确。

## 引用关系

| 片段 | 被以下页面引用 |
| --- | --- |
| `chart-1` ~ `chart-6` | `guide/chart/chart.md` |
| `echarts-1` ~ `echarts-10` | `guide/chart/echarts.md` |
| `mermaid-1` ~ `mermaid-17` | `guide/chart/mermaid.md` |
| `include-1`、`include-2` | `guide/markdown/v-include.md` |
| `code-block.snippet.md` | `guide/code/intro.md` |
| `create.snippet.md` | `guide/quick-start/usage.md` |
| `whitespace.snippet.md` | `config/plugins/shiki.md`、`guide/code/features.md` |
| `snippet-1.js`（非 `.snippet.md`） | `guide/code/import.md`、`blog/1.示例/markdown扩展.md`（通过 `@[code]` 引用） |

::: tip `foo.snippet.md` 只是语法示例

`guide/markdown/v-include.md` 中出现的 `@include: ./foo.snippet.md` 属于语法演示，
对应的 `foo.snippet.md` **并不存在**，不是缺失文件。
:::
