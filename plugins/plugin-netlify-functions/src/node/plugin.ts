/**
 * 如果是把 vuepress 站点部署的 netlify上，那么可以借助 netlify 上的 functions 功能，
 * 为我们的站点提供 serverless 能力。
 *
 * 比如，通过这个插件，在functions 中 连接 类似 firebase 等 数据存储服务，
 * 可以用来存储一些如 页面访问次数、访客总数等。还可以基于此来开发如 博客 留言墙、说说 等功能
 *
 * 为了使这个插件能够更加通用，同时可以成为其他插件的依赖
 * 在设计上，本插件仅作为 netlify functions server，
 * 并将提代理到 vuepress 的开发服务器上。
 * 同时收集 用户自定义的 functions 脚本，以及其他插件提供的 functions 脚本
 *
 * 在开发环境中，所有脚本 默认都被 编译到 .vuepress/.temp/functions 目录中。
 * netlify 本地 functions server 也将指向这个目录。
 * 启动的服务器， 请求functions的地址为：
 * http://localhost:{port}/.netlify/functions/{function-name}
 *
 * 出于通用性考虑，本插件应该优先于 依赖本插件的其他插件 之前进行加载。
 *
 * 在其他插件中应该使用 useNetlifyFunctionsPlugin() 来获取 本插件的功能
 *
 * 待解决的问题：
 * - 其他插件如果使用了非 用户定义的 proxyPrefix， 是否要在 netlify.toml 中
 *   再生成一个 redirect 配置
 * - 如何解决可能存在的 插件之间的 functions 命名冲突
 *
 */
import type { App, Plugin } from 'vuepress/core'
import type {
  NetlifyFunctionsOptions,
  NetlifyFunctionsPluginOptions,
} from '../shared/index.js'
import { extendsBundlerOptions } from './extendsBundlerOptions.js'
import type { NetlifyServe } from './netlify/index.js'
import {
  generateFunctions,
  generateNetlifyConfig,
  initialFunctions,
  netlifyServe,
} from './netlify/index.js'

function initOptions(app: App, {
  sourceDirectory,
  destDirectory,
  proxyPrefix = '/api',
}: NetlifyFunctionsOptions): NetlifyFunctionsPluginOptions {
  return {
    directory: {
      source: [sourceDirectory || app.dir.source('.vuepress/functions')],
      dest: destDirectory || app.dir.dest('functions'),
      temp: app.dir.temp('functions'),
    },
    proxyPrefix,
  }
}

const cache = {
  options: {},
}

export function getOptions(): NetlifyFunctionsPluginOptions {
  return cache.options as NetlifyFunctionsPluginOptions
}

/**
 *
 * netlify function 插件，提供 netlify functions 支持
 *
 * @param options
 */
export function netlifyFunctionsPlugin(options: NetlifyFunctionsOptions = {}): Plugin {
  return (app: App) => {
    const opts = initOptions(app, options)
    let server: NetlifyServe
    cache.options = opts
    return {
      name: 'vuepress-plugin-netlify-functions',

      onInitialized: async (app) => {
        // 启动netlify functions server
        if (!app.env.isBuild) {
          // 初始化用户侧的 functions
          await initialFunctions(app, opts)
          server = await netlifyServe(opts)
        }
      },

      onWatched: (app, watchers) => {
        watchers.push(server)
      },

      extendsBundlerOptions: (bundlerOption, app: App) => {
        extendsBundlerOptions(bundlerOption, app, opts, server.host)
      },

      onGenerated: async (app: App) => {
        // 生成配置文件
        generateNetlifyConfig(app, opts)
        await generateFunctions(app, opts)
      },
    }
  }
}
