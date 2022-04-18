# `@vuepress-plume/vuepress-plugin-caniuse`

为 markdown 添加 can-i-use 容器支持
## Install
```
yarn add @vuepress-plume/vuepress-plugin-caniuse
```
## Usage
``` js
// .vuepress/config.js
module.exports = {
  //...
  plugins: [
    ['@vuepress-plume/vuepress-plugin-caniuse', { mode: 'embed' }]
  ]
  // ...
}
```

### options

- mode: 渲染模式，默认值 `embed`
  - embed: 交互式嵌入，通过 iframe 嵌入可交互的 can-i-use
  - image: 仅添加 图片

``` md
::: caniuse css-matches-pseudo
:::
```

## 效果

![css-dir-pseudo](https://caniuse.bitsofco.de/image/css-dir-pseudo.webp)
