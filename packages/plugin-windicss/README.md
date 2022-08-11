# `@vuepress-plume/vuepress-plugin-windicss`

添加 `windicss` 支持

## Install
```
yarn add @vuepress-plume/vuepress-plugin-windicss
```
## Usage
``` js
// .vuepress/config.js
module.exports = {
  //...
  plugins: [
    windicssPlugin(options)
  ]
  // ...
}
```

## Method

`windicssPlugin(options)`

- `options`: `{ userOptions?: UserOptions; utilsOptions?: WindiPluginUtilsOptions } | string`
  
  windicss 配置文件路径，或者 windicss配置
