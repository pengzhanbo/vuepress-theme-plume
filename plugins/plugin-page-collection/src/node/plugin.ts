/**
 * 如果是一个 仅 提供 functions 支持的插件，
 * 基本上可以照搬本文件进行插件声明
 * 然后在此基础上进行修改
 */

// 通过引入 'vuepress-plugin-netlify-functions' 插件，来为本插件提供
// netlify functions 开发时支持
import type { App, Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import { useNetlifyFunctionsPlugin } from 'vuepress-plugin-netlify-functions'
import type { PageCollectionOptions } from '../shared/index.js'

const __dirname = getDirname(import.meta.url)

export function pageCollectionPlugin(_options: PageCollectionOptions = {}): Plugin {
  return (app: App) => {
    const {
      // 客户端发起 functions 请求时的代理前缀
      // 默认是 /api
      // /api/* 的请求实际被转发到了 netlify functions 服务器的 /.netlify/functions/*
      proxyPrefix,
      // 在开发环境中，需要将 自定义到 functions 文件，注入到 netlify functions 服务中
      // 这样才能够被请求到
      preparePluginFunctions,
      // vuepress 构建生产包时，打包这些 functions文件到 vuepress dest中。
      generatePluginFunctions,
    } = useNetlifyFunctionsPlugin(app, {
      // 一般来说， 都是设置为 path.join(__dirname, 'functions')
      // 即是当前文件同级的 functions 目录
      // 这个目录的文件都会被监听，然后注入到 netlify functions 服务中
      directory: path.join(__dirname, 'functions'),
    })
    return {
      name: '@vuepress-plume/plugin-page-collection',
      define: () => ({
        // 将 proxyPrefix 注入到 客户端中
        // 以便获取使用
        __COLLECTION_PROXY_PREFIX__: proxyPrefix,
      }),
      clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
      // 不要忘了，需要在这里 定义好 钩子
      onPrepared: () => preparePluginFunctions(),
      onGenerated: () => generatePluginFunctions(),
    }
  }
}
