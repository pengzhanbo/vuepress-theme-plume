# `@vuepress-plume/plugin-content-update`

替换 `@vuepress/client` 的 `<Content />` 组件，注入 `onContentUpdated` 生命周期。
实现当页面内容发生更新时，触发 `onContentUpdated` 事件。

## Install
```
yarn add @vuepress-plume/plugin-content-update
```
## Usage
``` js
// .vuepress/config.js
const { contentUpdatePlugin } = require('@vuepress-plume/plugin-content-update')
module.exports = {
  // ...
  plugins: [
    contentUpdatePlugin()
  ]
  // ...
}
```
