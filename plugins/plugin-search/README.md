# `@vuepress-plume/plugin-search`

使用 [`minisearch`](https://lucaong.github.io/minisearch/) 实现的本地 全文模糊搜索 插件。

## Install

```sh
npm install @vuepress-plume/plugin-search
# or
pnpm add @vuepress-plume/plugin-search
# or
yarn add @vuepress-plume/plugin-search
```

## Usage

``` js
// .vuepress/config.[jt]s
import { searchPlugin } from '@vuepress-plume/plugin-search'

export default {
  // ...
  plugins: [
    searchPlugin()
  ]
  // ...
}
```
