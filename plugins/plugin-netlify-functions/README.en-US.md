# `vuepress-plugin-netlify-functions`

English | [简体中文](./README.md)

If your vuepress site is deployed on `netlify` and you want to be able to use `netlify functions` for `serverless`.

You may need this plugin to provide support.

## Features

- On the Vuepress local server, start a `Netlify Functions` local service to help you debug `functions` locally.
- Generate a usable `netlify.toml` and add the appropriate 'functions' configurations if you have already created`netlify.toml`
- This plugin does not provide specific `function` scripts, only `netlify functions` support;
  It can be used directly in themes, directly in vuepress projects, or based on this plugin,
  new plugins can be developed to provide more detailed functionality support.
- Use `dotenv` to provide support similar to `Netlify Environment variables` in the local service
  environment. Create `.env` files in the project root directory to hold development-time environment variables

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

   ``` ts
   import { useNetlifyFunctionsPlugin } from 'vuepress-plugin-netlify-functions'

   function myPlugin(): Plugin {
     return (app: App) => {
       const {
         // proxy prefix, default: /api
         proxyPrefix,
         preparePluginFunctions,
         generatePluginFunctions
       } = useNetlifyFunctionsPlugin(app, {
         // Specifies the functions directory for the plugin where the relevant scripts are developed
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

#### options

- `options.sourceDirectory` functions source directory。

  @default `app.dir.source('.vuepress/functions')。

- `options.destDirectory` functions output directory

  @default `app.dir.dest('function')

- `options.proxyPrefix` server proxy prefix

  @default `/api`。

  functions request to proxy `^/api/*`

### `useNetlifyFunctionsPlugin(app, options)`

Used in the plugin when developing the VuePress plugin

- `app`: **App**

- `options.directory`

  Functions development directory in plugin

## Example

- [vuepress-plugin-page-collection](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-page-collection)
  Log and display the number of page views/visits of blog articles by connecting `leanCloud` in functions based on `netlify-functions`
