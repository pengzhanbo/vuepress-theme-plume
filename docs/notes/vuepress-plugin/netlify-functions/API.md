---
title: API
createTime: 2022/05/13 05:49:14
author: pengzhanbo
permalink: /note/vuepress-plugin/netlify-functions/api/
---

## netlifyFunctionsPlugin(options)

在 vuepress 项目中使用， 或者 开发vuepress-theme时使用，提供 netlify-functions 开发时服务。

该插件应该优先于其他有依赖该插件的其他插件之前调用。

``` js
netlifyFunctionsPlugin({
  sourceDirectory: '',
  destDirectory: '',
  proxyPrefix: '',
})
```

### options

__类型：__ `{ sourceDirectory: string, destDirectory: string, proxyPrefix: string }`

- `options.sourceDirectory`:
  
  `functions` 开发时所在目录， 默认值： `app.dir.source('.vuepress/functions')`,
  即，如果你的vuepress项目源码目录是 `src`， 那么 `sourceDirectory` 默认为 `src/.vuepress/functions/`

- `options.destDirectory`:
  
  `functions` 构建后输出目录，默认值： `app.dir.dest('functions')`,
  即，如果你的 vuepress项目配置的 `dest` 输出目录为 `docs`， 那么默认输出目录为 `docs/functions`,
  一般来说，这个配置不需要手动修改。

- `options.proxyPrefix`:
  
  在开发环境中， `Netlify Functions` 服务的默认路径是 `/.netlify/functions/*`, 但这并不能保持开发环境和
  生产部署环境一致，所以需要将路径重写。

  默认值： `/api` 

  即 `^/api/*` 的请求会被转发到 `/.netlify/functions/*` ，
  如, `functions/my_function.ts` ，则请求 `/api/my_function` 将会转发到 `/.netlify/functions/my_function`。



## useNetlifyFunctionsPlugin(app, options)

在开发 vuepress plugin 时使用，为插件提供 `netlify functiosn` 支持

``` ts
import { useNetlifyFunctionsPlugin } from '@vuepress-plume/vuepress-plugin-netlify-functions'

const myPlugin = (): Plugin => {
  return (app: App) => {
    const {
      // 请求前缀,  默认 /api
      proxyPrefix,
      preparePluginFunctions,
      generatePluginFunctions
    } = useNetlifyFunctionsPlugin(app, {
       // 指定插件的functions目录，相关脚本在此目录中开发
      directory: path.resolve(__dirname, 'functions')
    })
    return {
      name: 'vuepress-plugin-myPlugin',
      onPrepared:() => preparePluginFunctions(),
      onGenerated: () => generatePluginFunctions(),
    }
  }
}
```

### options

__类型：__ `{ directory: string }`

- `options.directory` 
  
  插件中的 functions 开发目录。

  一般来说，它的值都设置为 `path.resolve(__dirname, 'functions')`
  

