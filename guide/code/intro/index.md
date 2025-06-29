---
url: /guide/code/intro/index.md
---
## 概述

主题 使用 [Shiki](https://shiki.style/) 在 Markdown 代码块实现语法高亮。

::: important 重要变更&#x20;

从 ==1.0.0-rc.136== 版本开始，主题已将代码高亮插件从主题内部实现的 `@vuepress-plume/plugin-shikiji` 迁移
到了 [vuepress ecosystem](https://github.com/vuepress/ecosystem) 提供的 [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html)。

*(无需担心变化太大，我也是 `@vuepress/plugin-shiki` 的主要开发者之一，它实现了与主题原插件一致的功能)*

其中涉及到部分配置项需要调整变更：

* `languages` 配置变更为 `langs` 选项。无需再手动添加你所使用的语言，插件将会自动识别并按需加载语言包。
* `themes` 配置变更为：
  * 当使用单主题配置时，使用 `theme` 配置代码块主题
  * 当使用双主题配置时，使用 `themes` 配置代码块主题。

:::

## 语言

[Shiki](https://shiki.style/) 支持 超过 190+ 种语言，
你可以在 [languages](https://shiki.style/languages) 查看所有支持的语言列表。

你可以通过以下语法为你使用的 语言所编写的代码 实现高亮效果：

````md
``` [lang]
<!-- 代码内容 -->
```
````

其中，`[lang]` 为你使用的语言。

示例：

````md
// [!code word:js]
``` js
const a = 1
console.log(a)
```
````

```js
const a = 1
console.log(a)
```

## 高亮主题

[Shiki](https://shiki.style/) 支持 超过 40+ 种高亮主题。

你可以在 [Themes](https://shiki.style/themes) 找到所有支持的主题列表，根据个人的喜欢自定义
高亮主题。

Theme Plume 默认为 代码块使用的主题配置：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' }, // [!code highlight]
    }
  })
})
```

默认配置支持在 亮色/暗色 模式分别使用 `vitesse-light`/`vitesse-dark` 主题。

## 更多支持

得益于 [Shiki](https://shiki.style/) 的强大能力，Theme Plume 还为 代码块
提供了 更多的 [特性支持](./features.md)，它们让 代码块具备更强的表达能力。

同时，为了方便 更好的 完成 代码演示，Theme Plume 还提供了嵌入 [CodePen](../repl/codepen.md)，
[Js Fiddle](../repl/jsFiddle.md)，[Code Sandbox](../repl/codeSandbox.md)，
[Replit](../repl/replit.md) 的语法支持，你可以很方便的嵌入代码演示。

## 示例
