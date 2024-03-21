# vuepress-plugin-caniuse

VuePress 2 Plugin

VuePress 2 插件

在Markdown中添加 [can-i-use](https://caniuse.com/) 支持，这对于你在写前端技术博客时，说明某个feature的兼容性时特别有用。

## Install

``` sh
npm install @vuepress-plume/plugin-caniuse
# or
pnpm add @vuepress-plume/plugin-caniuse
# or
yarn add @vuepress-plume/plugin-caniuse
```

## Usage

### 在VuePress 配置文件中添加插件

``` js
// .vuepress/config.[jt]s
import { caniusePlugin } from '@vuepress-plume/plugin-caniuse'

export default {
  // ...
  plugins: [
    caniusePlugin({ mode: 'image' }),
  ]
  // ...
}
```

### 在markdown中编写

``` md
::: caniuse <feature> {{browser_versions}}
:::
```

### Options

- `options.mode`: can-i-use插入文档的模式， 支持 `embed` 和`image`, 默认值是 `image`。
  - `image`: 插入图片
  - `embed`: 使用iframe嵌入 can-i-use

### \<feature>

正确取值请参考 [https://caniuse.bitsofco.de/](https://caniuse.bitsofco.de/)

### \{browser_versions\}`

可选。当前特性在多个版本中的支持情况。

格式： `{number,number,...}`  取值范围为 `-5 ~ 3`

- 小于`0` 表示低于当前浏览器版本的支持情况
- `0` 表示当前浏览器版本的支持情况
- 大于`0` 表示高于当前浏览器版本的支持情况

## Example

``` md
::: caniuse css-matches-pseudo {-2,-1,1}
:::
```

效果：
![can-i-use css-matches-pseudo](https://caniuse.bitsofco.de/image/css-dir-pseudo.webp)
