---
url: /guide/markdown/container/index.md
---
::: tip 提示容器能够帮助你在文档中突出显示重要信息，让内容层次更加清晰。
:::

提示容器通过类型、标题和内容来定义不同的信息展示样式。

## 默认标题样式

**输入示例：**

```md
::: note
这是一个注释框
:::

::: info
这是一个信息框
:::

::: tip
这是一个提示框
:::

::: warning
这是一个警告框
:::

::: caution
这是一个危险警告框
:::

::: details
这是一个详情折叠框
:::
```

**实际效果：**

::: note
这是一个注释框
:::

::: info
这是一个信息框
:::

::: tip
这是一个提示框
:::

::: warning
这是一个警告框
:::

::: caution
这是一个危险警告框
:::

::: details
这是一个详情折叠框
:::

## 自定义标题设置

通过在容器类型后添加文本，可以轻松设置自定义标题。

**输入示例：**

````md
::: caution STOP
危险区域，请勿继续
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::
````

**实际效果：**

::: caution STOP
危险区域，请勿继续
:::

::: details 点我查看代码

```js
console.log('Hello, VuePress Plume!')
```

:::
