import type { App, PluginObject } from 'vuepress/core'
import { path } from 'vuepress/utils'
import * as cpx2 from 'cpx2'
import type { UseNetlifyFunctionPluginsOptions } from '../shared/index.js'
import { getOptions, netlifyFunctionsPlugin } from './plugin.js'

interface UseNetlifyFunctionResult {
  /**
   * functions 请求前缀
   */
  proxyPrefix: string

  /**
   * 在 插件的 onPrepare 钩子中调用，监听 当前插件的 functions 目录
   */
  preparePluginFunctions: () => void
  /**
   * 在 插件的 onGenerate 钩子中调用，将 当前插件的 functions 文件推送到 dest中
   */
  generatePluginFunctions: () => void
}
export function useNetlifyFunctionsPlugin(app: App, options: UseNetlifyFunctionPluginsOptions): UseNetlifyFunctionResult {
  if (typeof options === 'undefined')
    throw new Error('useNetlifyFunctionsPlugin [options] argument not found.')

  if (typeof options.directory !== 'string' || !options.directory) {
    throw new Error(
      `useNetlifyFunctionsPlugin [options.directory] must be a string\n exp: path.join(__dirname, 'functions')`,
    )
  }
  const plugins = app.pluginApi.plugins
  if (
    !plugins.some(
      (plugin: PluginObject) =>
        plugin.name === 'vuepress-plugin-netlify-functions',
    )
  ) {
    app.use(netlifyFunctionsPlugin())
  }

  const { proxyPrefix, directory } = getOptions()
  const source = path.join(options.directory, '**/*.js')

  function preparePluginFunctions(): void {
    if (!app.env.isBuild) {
      cpx2.watch(source, directory.temp, {
        ignore: ['!**/*.d.js'],
      })
    }
  }

  function generatePluginFunctions(): void {
    cpx2.copy(source, directory.dest)
  }

  return { proxyPrefix, preparePluginFunctions, generatePluginFunctions }
}
