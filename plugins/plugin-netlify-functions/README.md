# `vuepress-plugin-netlify-functions`

If your vuepress site is deployed on `netlify` and you want to be able to use `netlify functions` for ` serverless`.

You may need this plugin to provide support.

如果你的 vuepress 站点是部署在 `netlify` 的，而且希望能够使用`netlify functions` 来做 `serverless`。

那么你可能需要本插件提供支持。

## Feature

- On the Vuepress local server, start a `Netlify Functions` local service to help you debug `functions` locally.
- Generate a usable `netlify.toml` and add the appropriate 'functions' configurations if you have already created` netlify.toml`
- This plugin does not provide specific `function` scripts, only `netlify functions` support; It can be used directly in themes, directly in vuepress projects, or based on this plugin, new plugins can be developed to provide more detailed functionality support.
- Use `dotenv` to provide support similar to `Netlify Environment variables` in the local service environment. Create `.env` files in the project root directory to hold development-time environment variables

## 功能
- 在 vuepress 本地服务器上，启动一个 `netlify functions` 本地服务，帮助你在本地对 `functions` 进行调试。
- 帮助生成一个 可用的 `netlify.toml` ，如果你已经创建了 `netlify.toml`，会添加合适的 `functions` 配置
- 本插件不提供具体的 `function` 脚本,仅提供 `netlify functions` 支持；可以在主题中直接只用，也可以在 vuepress 项目中直接使用，也可以基于本插件，开发新的插件提供更详细的功能支持。
- 使用 `dotenv` 在本地服务环境提供 类似于 `netlify environment variables` 支持。 在项目根目录下 创建 `.env` 文件用于保存开发时环境变量

## Install

```sh
npm install vuepress-plugin-netlify-functions
# or
pnpm add vuepress-plugin-netlify-functions
# or
yarn add vuepress-plugin-netlify-functions
```
## Usage

1. In a Vuepress project, or in a Vuepress theme

   在 vuepress 项目中，或者在一个 vuepress 主题中
   ``` js
   // .vuepress/config.[jt]s
   import { netlifyFunctionsPlugin } from 'vuepress-plugin-netlify-functions'

   export default {
     // ...
     plugins: [
       netlifyFunctionsPlugin()
     ]
     // ...
   }
   ```

2. In a vuepress plugin:

   在 vuepress plugin 中：
   ``` js
   import { useNetlifyFunctionsPlugin } from 'vuepress-plugin-netlify-functions'

   function myPlugin(): Plugin {
     return (app: App) => {
       const {
         // proxy prefix, default: /api
         // 请求前缀,  默认 /api
         proxyPrefix,
         preparePluginFunctions,
         generatePluginFunctions
       } = useNetlifyFunctionsPlugin(app, {
         // Specifies the functions directory for the plugin where the relevant scripts are developed
         // 指定插件的functions目录，相关脚本在此目录中开发
         directory: path.resolve(__dirname, 'functions')
       })
       return {
         name: 'vuepress-plugin-myPlugin',
         onPrepared: () => preparePluginFunctions(),
         onGenerated: () => generatePluginFunctions(),
       }
     }
   }
   ```

## Methods

### `netlifyFunctionsPlugin(options)`

plugin function

In the Vuepress configuration, or in the Vuepress topic configuration.

插件函数。

在 vuepress 配置中，或者在 vuepress 主题配置中使用。

__options__

- `options.sourceDirectory` functions source directory。

  @default `app.dir.source('.vuepress/functions')。

- `options.destDirectory` functions output directory

  @default `app.dir.dest('function')

- `options.proxyPrefix` server proxy prefix

  @default `/api`。

  functions request to proxy `^/api/*`

__options__

- `options.sourceDirectory` functions 源文件夹。

  默认 `app.dir.source('.vuepress/functions') 目录。

- `options.destDirectory` functions 输出文件夹。

  默认 `app.dir.dest('function') 目录

- `options.proxyPrefix` proxy代理前缀。

  默认 `/api`。

  functions下的请求通过 `/api` 转发

### `useNetlifyFunctionsPlugin(app, options)`

Used in the plugin when developing the VuePress plugin

在 开发 vuepress 插件时， 在插件中使用

__app__: `App`

__options__

- `options.directory`

  Functions development directory in plugin

  插件中的 functions 开发目录

## 查看详细说明文档

待补充

## Example

- [vuepress-plugin-page-collection](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-page-collection) Log and display the number of page views/visits of blog articles by connecting `leanCloud` in functions based on `netlify-functions`

## 示例

### 插件开发示例

- [vuepress-plugin-page-collection](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-page-collection) 基于 netlify-functions 的，通过在 functions中连接 `leancloud` 实现 博客文章页 阅读数/访问次数 的记录与展示。
