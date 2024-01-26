import type { App } from 'vuepress/core'
import type { NetlifyFunctionsPluginOptions } from '../shared/index.js'

export function extendsBundlerOptions(bundlerOption: any, app: App, options: NetlifyFunctionsPluginOptions, server: string): void {
  // 在 netlify-cli 的 function:serve 中，
  // 默认就是 指向 /.netlify/functions
  // 而配置的 --functions 仅作为源文件入口
  const targetPath = '/.netlify/functions'
  if (app.options.bundler.name === '@vuepress/bundler-vite') {
    const rewriteRE = new RegExp(`^${options.proxyPrefix}`)
    bundlerOption.viteOptions.server = bundlerOption.viteOptions.server || {}
    const viteServer = bundlerOption.viteOptions.server
    // 将 netlify functions server 代理到 当前的 vuepress 开发 服务器上
    viteServer.proxy = Object.assign(viteServer.proxy || {}, {
      [options.proxyPrefix as string]: {
        target: server,
        changeOrigin: true,
        rewrite: (url: string) => url.replace(rewriteRE, targetPath),
      },
    })
  }
  if (app.options.bundler.name === '@vuepress/bundler-webpack') {
    const rewritePath = `^${options.proxyPrefix}`
    bundlerOption.configureWebpack(
      (config: any, isServer: boolean, isBuild: boolean) => {
        if (isBuild)
          return
        config.devServer = config.devServer || {}
        config.devServer.proxy = Object.assign(config.devServer.proxy || {}, {
          [options.proxyPrefix as string]: {
            target: server,
            changeOrigin: true,
            pathRewrite: { [rewritePath]: targetPath },
          },
        })
      },
    )
  }
}
