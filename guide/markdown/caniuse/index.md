---
url: /guide/markdown/caniuse/index.md
---
## 概述

在编写文章时， 提供嵌入 [can-i-use](https://caniuse.com/) WEB feature 各平台支持说明 的功能。

方便在描述某个 WEB feature 时，能更直观的表述 该特性的支持程度。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdownP: {
      caniuse: true, // [!code ++]
    },
  })
})
```

在你的 文章 markdown文件中，使用以下格式：

```md
@[caniuse](feature)
```

为了方便使用，主题提供了工具支持：[caniuse 特性搜索](../../../tools/caniuse.md)，你可以直接使用该工具
帮助生成 markdown 代码。

## 语法

```md
@[caniuse](feature)
@[caniuse{browser_versions}](feature)
@[caniuse embed_type](feature)
@[caniuse embed_type{browser_versions}](feature)
```

:::info 使用主题提供的 caniuse 工具：[caniuse 特性搜索](../../../tools/caniuse.md) 帮助生成 markdown 代码。
:::

* `feature`

  必填。 正确取值请参考 [caniuse-embed.vercel.app](https://caniuse-embed.vercel.app/zh-CN)

* `{browser_period}`

  可选。当前特性在多个版本周期中的支持情况。

  默认值为: `{-2,1}`

  格式： `{past,future}`  取值范围为 `-5 ~ 3`

  * 小于`0` 表示过去的浏览器版本周期的支持情况
  * `0` 表示当前浏览器版本的支持情况
  * 大于`0` 表示未来的浏览器版本周期的支持情况

* `embed_type`

  可选。 嵌入的类型。

  类型： `'embed' | 'baseline'`

  默认值为：`'embed'`

  * `embed` 表示嵌入为 类似 `caniuse.com` 的版本兼容数据表格
  * `baseline` 表示嵌入为 特性的基线支持情况。
    * `Wildly available` 表示受到所有主流浏览器的广泛支持
    * `Newly available` 表示仅受到最新主流浏览器的支持
    * `limit available` 表示主流浏览器可能部分支持，但支持程度有限，或者不支持
    * `deprecated` 表示主流浏览器已将其标记为 **弃用**，不推荐使用

## 示例

**获取 css 伪类选择器 `:dir()` 在各个浏览器的支持情况：**

```md
@[caniuse](css-matches-pseudo)
```

效果：

@[caniuse](css-matches-pseudo)

**显示 css 伪类选择器 `:dir()` 的基线支持情况：**

```md
@[caniuse baseline](css-matches-pseudo)
```

效果：

@[caniuse baseline](css-matches-pseudo)
