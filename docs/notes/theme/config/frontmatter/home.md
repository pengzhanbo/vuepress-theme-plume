---
title: 首页
author: pengzhanbo
createTime: 2024/03/03 15:00:43
permalink: /config/frontmatter/home/
---

## 概述

仅适用于 首页。在 `{sourceDir}/README.md` 中进行配置。

示例：

```md
---
home: true
config:
  - type: banner
  - type: custom
---
```

## 配置

### home <Badge type="warning" text="弃用" />

- 类型： `boolean`
- 详情：

  声明是否为 首页。

  已弃用，请使用 `pageLayout: 'home'` 代替。

### pageLayout

- 类型：`'home'`
- 详情：

  声明当前页面为 首页。

### config

- 类型： `PlumeHomeConfig[]`

定义 首页 区域

```ts
interface PlumeHomeConfigBase {
  /**
   * 该区域的类型，根据类型应用不同的组件
   */
  type: 'banner' | 'hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom' | string
  /**
   * 该区域是否占满全屏
   */
  full?: boolean
  /**
   * 该区域的背景图片
   * 你可以定义在 浅色/暗色 模式下的背景图片
   */
  backgroundImage?: string | { light: string, dark: string }
  /**
   * 该区域的背景 定位方式
   */
  backgroundAttachment?: 'fixed' | 'local'
}
```

更多详细配置请参考 [自定义首页](../../guide/自定义首页.md)
