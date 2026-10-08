---
url: /guide/embed/video/acfun/index.md
---
## 概述

主题提供了 嵌入 AcFun 视频 的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      acfun: true, // [!code ++]
    },
  })
})
```

## 语法

简单的语法：

```md
@[acfun](id)
```

更多选项：

```md
@[acfun width="100%" height="400px" ratio="16:9"](id)
```

**选项说明：**

* id: 视频 ID
* width: 视频宽度
* height: 视频高度
* ratio: 视频比例，默认 `16:9`

## 示例

### 宽频视频

输入：

```md
@[acfun](ac47431669)
```

输出：

@[acfun](ac47431669)
