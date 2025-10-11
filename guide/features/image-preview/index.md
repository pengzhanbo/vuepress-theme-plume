---
url: /guide/features/image-preview/index.md
---
在主题中，图片默认支持点击后放大预览。通过查找 文档内容中的图片，形成图片预览列表。

该功能由 [@vuepress/plugin-photo-swipe](https://ecosystem.vuejs.press/zh/plugins/features/photo-swipe.html) 插件提供支持。

## 配置

图片预览默认启用，也可以通过以下配置修改行为：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      photoSwipe: {
        // 图片选择器
        selector: '.vp-doc :not(a) > img:not([no-view],.no-view,.ignore)',
        download: true, // 是否显示下载按钮
        fullscreen: true, // 是否显示全屏按钮
        scrollToClose: true, // 是否在滚动时关闭当前图片
      }
    }
  })
})
```

更多配置请参考 [@vuepress/plugin-photo-swipe](https://ecosystem.vuejs.press/zh/plugins/features/photo-swipe.html)

## 忽略图片预览

可以通过 `no-view` 或 `ignore` 类名，或者 `no-view` 属性来忽略图片预览。

```md
![](path/to/image){.no-view}
![](path/to/image){.ignore}
![](path/to/image){no-view}

<img src="path/to/image" class="no-view">
<img src="path/to/image" class="ignore">
<img src="path/to/image" no-view>
```
