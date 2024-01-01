# `@vuepress-plume/plugin-blog-data`

## Install

```sh
npm install @vuepress-plume/plugin-blog-data
# or
pnpm add @vuepress-plume/plugin-blog-data
# or
yarn add @vuepress-plume/plugin-blog-data
```

## Usage

``` js
// .vuepress/config.[jt]s
import { blogDataPlugin } from '@vuepress-plume/plugin-blog-data'

export default {
  // ...
  plugins: [
    blogDataPlugin()
  ]
  // ...
}
```

## Options

```ts
interface BlogDataPluginOptions {
  include?: string | string[]
  exclude?: string | string[]
  sortBy?: 'createTime' | false | (<T>(prev: T, next: T) => boolean)
  excerpt?: boolean
  extendBlogData?: <T = any>(page: T) => Record<string, any>
}
```
