# `@vuepress-plume/vuepress-plugin-baidu-tongji`

在vuepress中接入百度统计

## Install
```
yarn add @vuepress-plume/vuepress-plugin-baidu-tongji
```
## Usage
``` js
// .vuepress/config.js
const { baiduTongjiPlugin } = require('@vuepress-plume/vuepress-plugin-baidu-tongji')
module.exports = {
  //...
  plugins: [
    baiduTongjiPlugin({
      key: '', // 百度统计使用的 key
    })
  ]
  // ...
}
```
