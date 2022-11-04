import type { App, Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import viteWindiCSS from 'vite-plugin-windicss'
import type { UserOptions, WindiPluginUtilsOptions } from 'vite-plugin-windicss'
import WebpackWindiCSSPlugin from 'windicss-webpack-plugin'

const __dirname = getDirname(import.meta.url)
export interface WindiCSSOptions {
  userOptions?: UserOptions
  utilsOptions?: WindiPluginUtilsOptions
}

export const windiCSSPlugin = (options?: WindiCSSOptions | string): Plugin => {
  let userOptions: UserOptions | undefined
  let utilsOptions: WindiPluginUtilsOptions | undefined
  if (typeof options === 'string') {
    userOptions = {
      config: options,
      include: ['**/.vuepress/**/*.{vue,jsx,tsx}', '**/*.md'],
    }
  } else {
    options = options || {}
    userOptions = options.userOptions
    utilsOptions = options.utilsOptions
  }
  return (app: App) => {
    const clientConfigFile =
      app.options.bundler.name === '@vuepress/bundler-vite'
        ? path.resolve(__dirname, '../client/config.vite.js')
        : path.resolve(__dirname, '../client/config.webpack.js')
    return {
      name: '@vuepress-plume/vuepress-plugin-windicss',
      clientConfigFile,
      extendsBundlerOptions: (bundlerOptions, app: App) => {
        if (app.options.bundler.name === '@vuepress/bundler-vite') {
          bundlerOptions.viteOptions ??= {}
          bundlerOptions.viteOptions.plugins ??= []
          bundlerOptions.viteOptions.plugins.push(
            viteWindiCSS(userOptions, utilsOptions)
          )
        }
        if (app.options.bundler.name === '@vuepress/bundler-webpack') {
          bundlerOptions.configureWebpack &&
            bundlerOptions.configureWebpack((config: any) => {
              config.plugins.push(new WebpackWindiCSSPlugin(userOptions))
            })
        }
      },
    }
  }
}
