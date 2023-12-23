# vuepress-plugin-caniuse

VuePress 2 Plugin

VuePress 2 插件

在Markdown中添加 [can-i-use](https://caniuse.com/) 支持，这对于你在写前端技术博客时，说明某个feature的兼容性时特别有用。

## Install
``` sh
yarn add @vuepress-plume/plugin-caniuse
```

## Usage

### 在VuePress 配置文件中添加插件
``` js
// .vuepress/config.js
export default {
  // ...
  plugins: [
    ['@vuepress-plume/plugin-caniuse', { mode: 'image' }]
  ]
  // ...
}
```
### 在markdown中编写
``` md
::: caniuse <feature>
:::
```

### Options

- `options.mode`: can-i-use插入文档的模式， 支持 `embed` 和`image`, 默认值是 `image`。
  - `image`: 插入图片
  - `embed`: 使用iframe嵌入 can-i-use

### \<feature>

正确取值请参考 [https://caniuse.bitsofco.de/](https://caniuse.bitsofco.de/)

## Example
``` md
::: caniuse css-matches-pseudo
:::
```
效果：
![can-i-use css-matches-pseudo](https://caniuse.bitsofco.de/image/css-dir-pseudo.webp)
