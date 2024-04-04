---
title: Js Fiddle
author: pengzhanbo
icon: bxl:jsfiddle
createTime: 2024/04/04 10:42:21
permalink: /guide/code/jsfiddle/
---

主题支持在 Markdown 文件中嵌入 [JS Fiddle](https://jsfiddle.net/)。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        jsfiddle: true, // [!code highlight]
      },
    }
  })
})
```

:::

## 语法

### 简单语法

```md
@[jsfiddle](user/id)
```

### 更多选项

```md
@[jsfiddle theme="dark" tab="js,css,html,result" height="500px"](user/id)
```

- `user`: 用户
- `id`: jsfiddle id
- `theme`: 主题模式， 可选值： `"light" | "dark"`
- `tab`: 选项卡， 可选值：`"js" | "css" | "html" | "result"`, 多个用 `","` 分割，
  顺序将决定选项卡的排序，默认为 `js,css,html,result`
- `height`: 高度

## 示例

输入：

```md
@[jsfiddle](pengzhanbo/1xbwz2p9)
```

输出：

@[jsfiddle](pengzhanbo/1xbwz2p9)

输入：

```md
@[jsfiddle tab="result,js,css,html"](pengzhanbo/1xbwz2p9)
```

输出：

@[jsfiddle tab="result,js,css,html"](pengzhanbo/1xbwz2p9)
