---
url: /guide/markdown/plot/index.md
---
## 概述

有时候，你不想直接把文本内容毫无保留的展示出来，想要保留一些 隐秘性，
可能是为了引起读者的好奇心，也可能纯粹是故意增加点阅读障碍，让文章变得更加有趣。

为了满足这种小小的心思，主题提供了一个 **“隐秘”文本** 的有趣小功能。它看起来像这样：

:::demo-wrapper
你知道吗， !!鲁迅!! 曾说过：“ !!我没说过这句话！!! ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的
力量！于是，!!我在床上翻了个身!! ！
:::

读者不能直接阅读到完整的内容，部分的内容被 “遮住”，需要鼠标悬停到内容上，才能看到被遮住的内容。

## 配置

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: true, // [!code ++]
    }
  })
})
```

`markdownPower.plot` 支持传入 `boolean | PlotOptions` 类型，该配置用于控制该功能的默认行为。

```ts
interface PlotOptions {
  /**
   * 触发方式
   *
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'

  /**
   * 遮罩层效果
   *
   * @default 'mask'
   */
  effect?: 'mask' | 'blur'
}
```

## 语法

```md
!!需要隐秘的内容!!
```

还可以通过属性语法控制行为：

```md
!!需要隐秘的内容!!{.click}
!!需要隐秘的内容!!{.hover}

!!需要隐秘的内容!!{.mask}
!!需要隐秘的内容!!{.blur}

!!需要隐秘的内容!!{.blur .click}
```

* `.click` - 点击触发
* `.hover` - 鼠标悬停触发
* `.mask` - 遮罩层效果
* `.blur` - 文本模糊效果

::: info 你也可以使用 [`<Plot />`](../components/plot.md) 组件替代。
:::

## Frontmatter

在 Frontmatter 中使用 `plot` 选项来控制在当前页面中该功能的默认行为：

```
---
plot:
  trigger: hover
  effect: blur
---
```

## 示例

**输入**：

```md
你知道吗， !!鲁迅!! 曾说过：“ !!我没说过这句话！!! ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的
力量！于是，!!我在床上翻了个身!! ！
```

**输出**：

:::demo-wrapper
你知道吗， !!鲁迅!! 曾说过：“ !!我没说过这句话！!!” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的
力量！于是，!!我在床上翻了个身!! ！
:::

**输入**：

```md
遮罩层效果 + 鼠标悬停：!!鼠标悬停看到我了!!{.mask .hover}
遮罩层效果 + 点击：!!点击看到我了!!{.mask .click}
文本模糊效果 + 鼠标悬停：!!鼠标悬停看到我了!!{.blur .hover}
文本模糊效果 + 点击：!!点击看到我了!!{.blur .click}
```

**输出**：

:::demo-wrapper
遮罩层效果 + 鼠标悬停：!!鼠标悬停看到我了!!{.mask .hover}

遮罩层效果 + 点击：!!点击看到我了!!{.mask .click}

文本模糊效果 + 鼠标悬停：!!鼠标悬停看到我了!!{.blur .hover}

文本模糊效果 + 点击：!!点击看到我了!!{.blur .click}
:::
