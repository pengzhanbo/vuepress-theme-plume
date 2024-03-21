# `@vuepress-plume/plugin-baidu-tongji`

在vuepress中接入百度统计

## Install

```sh
npm install @vuepress-plume/plugin-baidu-tongji
# or
pnpm add @vuepress-plume/plugin-baidu-tongji
# or
yarn add @vuepress-plume/plugin-baidu-tongji
```

## Usage

``` js
// .vuepress/config.[jt]s
import { baiduTongjiPlugin } from '@vuepress-plume/plugin-baidu-tongji'

export default {
  // ...
  plugins: [
    baiduTongjiPlugin({
      key: '', // 百度统计使用的 key
    })
  ]
  // ...
}
```
