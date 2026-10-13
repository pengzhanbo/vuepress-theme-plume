---
title: 首页
createTime: 2024/03/03 15:00:43
permalink: /config/frontmatter/home/
---

## 概述

仅适用于首页。在 `{sourceDir}/README.md` 中进行配置。

示例：

```md title="frontmatter"
---
pageLayout: home
config:
  - type: banner
  - type: custom
---
```

## 配置

### home <Badge type="warning" text="弃用" />

- 类型： `boolean`
- 详情：

  声明是否为首页。

  已弃用，请使用 `pageLayout: 'home'` 代替。

### pageLayout

- 类型：`'home'`
- 详情：

  声明当前页面为首页。

### config

- 类型： `ThemeHomeConfig[]`

定义首页区域，按数组顺序依次渲染。

```ts
interface ThemeHomeConfigBase {
  /**
   * 该区域的类型，根据类型应用不同的组件
   *
   * 传入其它字符串时，会按全局组件名解析，用于自定义区域组件
   */
  type: 'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text'
    | 'features' | 'profile' | 'custom' | 'posts' | string

  /**
   * 该区域的索引
   *
   * 主题在渲染时会按 `config` 数组的顺序重新注入该值，手写 frontmatter 时通常无需提供；
   * 但在源码类型中它是必填字段，使用 TS 约束 frontmatter 时需要补上。
   */
  index: number

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

  /**
   * 主题在渲染时按 `config` 的长度自动推导（长度为 1 时即为 `true`）并覆盖传入值，
   * 因此在配置中书写该项不会生效。
   */
  onlyOnce?: boolean
}
```

更多详细配置请参考 [自定义首页](../../guide/custom/home.md)

### signDown

- 类型： `boolean`
- 默认值： `false`
- 详情：

  是否显示向下前头的标志。
