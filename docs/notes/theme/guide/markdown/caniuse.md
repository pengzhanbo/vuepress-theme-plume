---
title: Can I Use
createTime: 2024/09/30 14:50:55
icon: streamline:desktop-help
permalink: /guide/markdown/caniuse/
---

## 概述

在编写文章时， 提供嵌入 [can-i-use](https://caniuse.com/) WEB feature 各平台支持说明 的功能。

方便在描述某个 WEB feature 时，能更直观的表述 该特性的支持程度。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        caniuse: true, // [!code highlight]
      },
    }
  })
})
```

:::

在你的 文章 markdown文件中，使用以下格式：

``` md
@[caniuse](feature)
```

为了方便使用，主题提供了工具支持：[caniuse 特性搜索](../../../tools/caniuse.md)，你可以直接使用该工具
帮助生成 markdown 代码。

## 语法

``` md
@[caniuse](feature)
@[caniuse{browser_versions}](feature)
@[caniuse embed_type](feature)
@[caniuse embed_type{browser_versions}](feature)
```

- `feature`

   必填。 正确取值请参考 [caniuse-embed.vercel.app](https://caniuse-embed.vercel.app/zh-CN)

- `{browser_versions}`

  可选。当前特性在多个版本中的支持情况。

  默认值为: `{-2,1}`

  格式： `{past,future}`  取值范围为 `-5 ~ 3`

  - 小于`0` 表示低于当前浏览器版本的支持情况
  - `0` 表示当前浏览器版本的支持情况
  - 大于`0` 表示高于当前浏览器版本的支持情况

- `embed_type`

  可选。 资源嵌入的类型。

  类型： `'embed' | 'image'`

  默认值为：`'embed'`

:::caution
不再推荐使用 image 类型，建议使用 embed 类型，主题更换了 embed 实现技术方案，
现在的 embed 类型优势已远远超过 image 类型，加载速度更快，体积更小，交互体验更好。
:::

## 示例

**获取 css 伪类选择器 `:dir()` 在各个浏览器的支持情况：**

```md
@[caniuse](css-matches-pseudo)
```

效果：

@[caniuse](css-matches-pseudo)

**以图片的形式，获取 css 伪类选择器 `:dir()` 在各个浏览器的支持情况：**

```md
@[caniuse image](css-matches-pseudo)
```

效果：

@[caniuse image](css-matches-pseudo)

**获取 css 伪类选择器 `:dir()` 特定范围浏览器的支持情况：**

```md
@[caniuse{-2,3}](css-matches-pseudo)
```

效果：

@[caniuse{-2,3}](css-matches-pseudo)
