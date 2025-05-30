---
title: 自定义样式
icon: icon-park-outline:theme
createTime: 2024/03/04 20:18:52
permalink: /guide/custom-style/
---

## 主题定制

支持自定义样式。

主题虽然使用 [SASS](https://sass-lang.com/) 作为 CSS 预处理器，但所有的颜色使用的是 `CSS Vars` 定义，
因此，你可以创建 一个 css 文件 或 scss 文件，进行覆盖。

首先，在 `.vuepress` 目录中，创建一个 `styles/index.css` 文件，
然后在 [客户端配置文件](https://v2.vuepress.vuejs.org/zh/guide/configuration.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6) 中，引入该文件即可。

:::code-tabs

@tab .vuepress/client.ts

```ts
import { defineClientConfig } from 'vuepress/client'

import './styles/index.css' // [!code ++]

export default defineClientConfig({
  // ...
})
```

@tab .vuepress/styles/index.css

```css
:root {
  --vp-c-brand-1: #5086a1;
}
```

:::

## Style 文件

在 `.vuepress` 目录中，创建一个如 `custom.css` 的文件，

在这里添加额外的样式，或者覆盖默认样式：

``` scss
:root {
  scroll-behavior: smooth;
}
```

你也可以利用它来覆盖默认主题的预定义 CSS 变量。

以下是部分预定义变量， 完整列表请参考 [vars.css](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/theme/src/client/styles/vars.css)

```scss
:root {
  /** 主题颜色 */
  --vp-c-brand-1: #5086a1;
  --vp-c-brand-2: #6aa1b7;
  --vp-c-brand-3: #8cccd5;
  --vp-c-brand-soft: rgba(131, 208, 218, 0.314);

 /** 背景颜色 */
  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f6f6f7;
  --vp-c-bg-elv: #ffffff;
  --vp-c-bg-soft: #f6f6f7;

  /** 文本颜色 */
  --vp-c-text-1: rgba(60, 60, 67);
  --vp-c-text-2: rgba(60, 60, 67, 0.78);
  --vp-c-text-3: rgba(60, 60, 67, 0.56);
}

[data-theme="dark"] {
  --vp-c-brand-1: #8cccd5;
  --vp-c-brand-2: #6aa1b7;
  --vp-c-brand-3: #5086a1;
  --vp-c-brand-soft: rgba(131, 208, 218, 0.314);

  --vp-c-bg: #1b1b1f;
  --vp-c-bg-alt: #161618;
  --vp-c-bg-elv: #202127;
  --vp-c-bg-soft: #202127;

  --vp-c-text-1: rgba(255, 255, 245, 0.86);
  --vp-c-text-2: rgba(235, 235, 245, 0.6);
  --vp-c-text-3: rgba(235, 235, 245, 0.38);
}
```

::: tip
主题提供了 [主题颜色工具](../../../tools/custom-theme.md) , 你可以使用它来创建自定义颜色。
:::
