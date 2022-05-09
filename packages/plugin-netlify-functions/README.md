# `@vuepress-plume/vuepress-plugin-netlify-functions`

如果你的 vuepress 站点是部署在 `netlify` 的，而且希望能够使用`netlify functions` 来做 `serverless`。

那么你可能需要本插件提供支持。

## 功能
- 在 vuepress 本地服务器上，启动一个 `netlify functions` 本地服务，帮助你在本地对 `functions` 进行调试。
- 帮助生成一个 可用的 `netlify.toml` ，如果你已经创建了 `netlify.toml`，会添加合适的 `functions` 配置
- 本插件不提供具体的 `function` 脚本,仅提供 `netlify functions` 支持；可以在主题中直接只用，也可以在 vuepress 项目中直接使用，也可以基于本插件，开发新的插件提供更详细的功能支持。
- 使用 `dotenv` 在本地服务环境提供 类似于 `netlify environment variables` 支持。 在项目根目录下 创建 `.env` 文件用于保存开发时环境变量

## Install
```
yarn add @vuepress-plume/vuepress-plugin-netlify-functions
```
## Usage

1. 在 vuepress 项目中，或者在一个 vuepress 主题中
   ``` js
   // .vuepress/config.js
   import { netlifyFunctionsPlugin } from '@vuepress-plume/vuepress-plugin-netlify-functions'
   module.exports = {
     //...
     plugins: [
        netlifyFunctionsPlugin()
     ]
     // ...
   }
   ```

2. 在 vuepress plugin 中：
   ``` js
   import { useNetlifyFunctionsPlugin } from '@vuepress-plume/vuepress-plugin-netlify-functions'

   const myPlugin = (): Plugin => {
     return (app: App) => {
       const {
         proxyPrefix, // 请求前缀 默认 /api
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

## Methods

### `netlifyFunctionsPlugin(options)`

插件函数。

在 vuepress 配置中，或者在 vuepress 主题配置中使用。

__options__

- `options.sourceDirectory` functions 源文件夹。
  
  默认 `app.dir.source('.vuepress/functions') 目录。

- `options.destDirectory` functions 输出文件夹。
  
  默认 `app.dir.dest('function') 目录

- `options.proxyPrefix` proxy代理前缀。
  
  默认 `/api`。
  
  functions下的请求通过 `/api` 转发

### `useNetlifyFunctionsPlugin(app, options)`

在 开发 vuepress 插件时， 在插件中使用

__app__: `App`

__options__

- `options.directory`  插件中的 functions 开发目录

## 查看详细说明文档

待补充
