# `@vuepress-plume/vuepress-plugin-iconify`

添加 `iconify` 图标库支持。并注入全局组件 `<Iconify>`

## Install
```
yarn add @vuepress-plume/vuepress-plugin-iconify
```
## Usage
``` js
// .vuepress/config.js
const iconifyPlugin = require('@vuepress-plume/vuepress-plugin-iconify')
module.exports = {
  //...
  plugins: [
    iconifyPlugin()
  ]
  // ...
}
```

## Options

```ts
interface IconifyOptions {
  /**
   * 组件名， 默认 `Iconify`
   */
  componentName?: string
  color?: string
  size?: string | number
}

```

## Component

```vue
<Iconify name="material-symbols:home" color="currentColor" size="1em" />
```
