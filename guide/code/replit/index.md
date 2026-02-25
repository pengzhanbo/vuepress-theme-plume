---
url: /guide/code/replit/index.md
---
\~~主题支持在 Markdown 文件中嵌入 [Replit](https://replit.com/)。~~

## 配置

此功能默认不启用，你可以在配置文件中启用它。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      replit: true, // [!code ++]
    },
  })
})
```

## 语法

简单的语法

```md
@[replit](user/repl-name)
```

更多选项

```md
@[replit title="" width="100%" height="450px" theme="dark"](user/repl-name#filepath)
```

* `title`: 标题
* `width`: 容器宽度
* `height`: 容器高度
* `theme`: 主题， 可选值 `dark` 和 `light`
* `user`: Replit 用户名
* `repl-name`: Replit repl 名称
* `filepath`: Replit 默认打开的文件路径

## 示例

输入：

```md
@[replit](@TechPandaPro/Cursor-Hangout#package.json)
```

输出：

@[replit](@TechPandaPro/Cursor-Hangout#package.json)
