# Window

A browser-window style frame — good for screenshots, previews and "what it looks like" demos.

Available by default, no config needed.

```md
:::: window
添加你的示例
::::

:::: window title="标题" height="400px" gap="16px"
### 三级标题

这是示例容器中的内容。
::::
```

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | `''` | text in the window bar |
| `height` | `string` | — | fixed body height (scrolls) |
| `gap` | `string` | — | horizontal padding of the body |

The container body accepts full markdown (headings, images, code, other containers). When nesting, give the
outer marker more colons.
