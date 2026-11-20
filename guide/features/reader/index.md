---
url: /guide/features/reader/index.md
---
## 概述

阅读偏好让读者自己决定阅读时的呈现：正文多宽、底色是什么、要不要显示阅读辅助线、要不要进入专注模式。

启用后页面右上角会出现「阅读」入口，改动立即生效，并保存在浏览器本地，下次打开同一站点依然有效。

该功能默认关闭，打开一个开关即可使用。

:::: tip 适用场景

以长文为主的文档站、教程站与博客。读者常在长文章中找不到位置，或者夜里觉得白底刺眼。

::::

## 快速开始

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: true, // [!code hl]
  }),
})
```

`true` 表示使用全部默认值，完整配置项见 [主题配置 · readerPreferences](../../config/theme.md#readerpreferences)。

入口位置随屏幕宽度变化：

| 屏幕宽度 | 入口位置 |
| --- | --- |
| `≥ 1280px` | 导航栏右侧的图标按钮 |
| `768 ~ 1280px` | 「更多」浮层，与深浅色切换同组 |
| `< 768px` | 移动端导航抽屉的「阅读」分组 |

面板中的改动立即生效，无需保存。「重置」会清空读者的全部选择，移动端抽屉中没有该按钮。

## 功能

| 功能 | 说明 | 默认 |
| --- | --- | --- |
| 继续阅读 | 再次打开同一篇文章时提示「上次读到 62%」，可选择继续阅读或从头开始 | 开启 |
| 内容宽度 | 窄 / 标准 / 宽 / 铺满四档，只调整正文栏，左侧导航不动 | 四档全部提供 |
| 护眼背景 | 切换默认 / 暖白 / 纸黄等底色，代码块、表格、提示框与导航栏一并变色 | 开启 |
| 品牌色 | 替换站点主色，深浅色模式下都可用 | 未配置时隐藏 |
| 阅读辅助线 | 跟随鼠标高亮当前段落，有遮罩、左侧、右侧三种形态 | 关闭 |
| 专注模式 | 隐藏导航栏、侧边栏、目录与页脚，按 `Esc` 或点右下角按钮退出 | 开启 |

继续阅读只做提示，不会自动滚动页面。

### 四档宽度

| 档位 | 正文宽度 | 说明 |
| --- | --- | --- |
| 窄 | 约 640px | 接近一本书的行长，适合长时间精读 |
| 标准 | 主题原本的宽度 | 默认档，与未启用该功能时一致 |
| 宽 | 约 1000px | 大屏上一次能看到更多内容 |
| 铺满 | 跟随屏幕 | 正文铺满视口，适合超宽屏与图表较多的页面 |

标准档不写入任何样式，读者停在这一档时页面与升级前完全一致。切换宽度后，图表等依赖窗口尺寸的组件会自动重算。

## 配置

### 关闭部分功能

每个子项都能单独关闭，关闭后面板中对应的分组随之消失：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      theme: false, // 不提供护眼背景
      readAid: false, // 不提供阅读辅助线
      focusMode: false, // 不提供专注模式
    },
  }),
})
```

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` | `false \| { presets }` | `true` | 宽度档位 |
| `theme` | `false \| { presets }` | `true` | 护眼背景 |
| `brand` | `false \| { presets }` | `false` | 品牌色 |
| `readAid` | `false \| 'mask' \| 'left' \| 'right' \| { modes, default }` | `true` | 阅读辅助线 |
| `focusMode` | `boolean` | `true` | 专注模式 |
| `resume` | `false \| ReaderResumeOptions` | `true` | 继续阅读 |
| `storagePrefix` | `string` | `'plume'` | 本地存储键前缀 |

### 限制可选宽度

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      width: { presets: ['wide', 'full'] },
    },
  }),
})
```

标准档始终保留，代表不做调整；其余档位不写进 `presets`，读者就不会看到。

### 继续阅读设置

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      resume: { prompt: true, ttl: 30, max: 100, minPercent: 0.1 },
    },
  }),
})
```

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `prompt` | `true` | 设为 `false` 时只记录位置，不弹提示 |
| `ttl` | `90` | 记录保留天数，取值 1–365 |
| `max` | `300` | 最多保留条数，取值 10–1000 |
| `minPercent` | `0.05` | 低于该进度不提示，取值 `0`–`1` |

### 阅读辅助线

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      readAid: true, // 三种形态，读者自选
      // readAid: 'left', // 以左侧辅助线为默认形态
      // readAid: { modes: ['mask'], default: 'mask' }, // 只提供遮罩
    },
  }),
})
```

`mask` 是跟随鼠标的遮罩，`left` 与 `right` 是在左侧或右侧画一条辅助线。

旧版本写在集合或语言配置中的 `readAid` 仍然有效，作为读者未选择时的默认形态。

### 自定义配色

护眼背景与品牌色都用调色板描述：一个名字加一组 CSS 变量。面板会把它们渲染成纯色块。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      theme: {
        presets: [
          'default',
          'warm',
          {
            name: 'forest',
            label: '护眼绿',
            tokens: {
              'vp-c-bg': '#eef5ec',
              'vp-c-bg-alt': '#e6efe3',
              'vp-c-text-1': '#2b3529',
            },
          },
        ],
      },
      brand: {
        presets: [
          { name: 'ocean', label: '海蓝', tokens: { 'vp-c-brand-1': '#0e7490' } },
        ],
      },
    },
  }),
})
```

* `default`（斜线色块）表示沿用主题配色，始终排在第一位；
* 色块颜色默认取 `--vp-c-bg` / `--vp-c-brand-1`，可用 `color` 指定；
* `tokens` 的键可以省略 `--` 前缀；背景常用的有 `--vp-c-bg`、`--vp-c-bg-alt`、`--vp-c-bg-soft`、`--vp-c-bg-elv`、`--vp-c-text-1` ~ `--vp-c-text-3`、`--vp-c-divider`、`--vp-code-block-bg`；
* 分组只剩 `default` 时会自动隐藏。

:::: warning 护眼背景不适用于深色模式

深色模式下背景分组会被禁用：深色配「纸黄」这类底色不可读。深色模式仍由 `appearance` 控制。

::::

### 多语言

阅读偏好按语言生效，写在 `locales` 中：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': { readerPreferences: { readAid: true } },
      '/en/': { readerPreferences: { readAid: false } },
    },
  }),
})
```

读者切换语言时，面板内容随之变化。偏好在浏览器中只有一份（按域名存储），希望各语言互不影响时，给它们设置不同的 `storagePrefix`。

### 面板文案

面板中的文字都可以在 `locales` 中改写，见 [多语言配置 · 阅读偏好](../../config/locales.md#阅读偏好-reader)。

## 站点定制

### 单页关闭

在 frontmatter 中关闭后，该页不再记录阅读位置，也不提示继续阅读：

```md
---
title: 某篇不需要记录进度的页面
reader: false
---
```

详见 [通用 Frontmatter · reader](../../config/frontmatter/basic.md#reader)。

### 同域名多站点

阅读偏好保存在浏览器本地，按域名隔离。同一域名部署多个站点时会互相覆盖，为每个站点设置不同的前缀：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    readerPreferences: {
      storagePrefix: 'my-docs',
    },
  }),
})
```

### 自定义样式

读者的选择会写到 `<html>` 的 `data-reader-*` 属性上，可据此微调样式：

```css title=".vuepress/styles/index.css"
/* 读者选择「宽」时，把正文再放宽一些 */
html[data-reader-width="wide"] .vp-doc-container .content-container {
  max-width: 1080px;
}
```

可用属性有 `data-reader-width`（`narrow` / `wide` / `full`）、`data-reader-theme`、`data-reader-brand`、`data-reader-focus`；标准档与默认档不写属性。样式的引入方式见 [自定义样式](../custom/style.md)。

## 小屏幕

内容宽度、阅读辅助线与专注模式是桌面专属控件：屏幕宽度 `≤ 768px` 时自动禁用、从面板隐藏，使用默认值。

| 控件 | 小屏行为 | 原因 |
| --- | --- | --- |
| 内容宽度 | 标准档 | 正文本就铺满屏幕，其他档位无效，或只是无谓地收窄正文 |
| 阅读辅助线 | 关闭 | 触摸屏没有悬停，辅助线无处跟随 |
| 专注模式 | 关闭 | 导航栏是打开导航抽屉的唯一入口 |
| 护眼背景 / 品牌色 | 保留 | 与屏幕尺寸无关 |

桌面上的选择不会被清除，回到大屏后自动恢复；小屏也不会先闪一次宽布局。

若某个语言只启用了这三项、又没有配置配色，小屏上不会出现阅读入口——面板里已没有可操作项。
