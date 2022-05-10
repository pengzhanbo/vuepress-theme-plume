import { useNetlifyFunctionsPlugin } from '@vuepress-plume/vuepress-plugin-netlify-functions'
import type { App, Plugin } from '@vuepress/core'
import { path } from '@vuepress/utils'
import type { PageCollectionOptions } from '../shared'

export const pageCollectionPlugin = (
  options: PageCollectionOptions = {}
): Plugin => {
  return (app: App) => {
    const { proxyPrefix, preparePluginFunctions, generatePluginFunctions } =
      useNetlifyFunctionsPlugin(app, {
        directory: path.join(__dirname, 'functions'),
      })
    return {
      name: '@vuepress-plume/vuepress-plugin-page-collection',
      define: () => ({
        __COLLECTION_PROXY_PREFIX__: proxyPrefix,
      }),
      clientAppEnhanceFiles: path.resolve(
        __dirname,
        '../client/clientAppEnhance.js'
      ),
      onPrepared: () => preparePluginFunctions(),
      onGenerated: () => generatePluginFunctions(),
    }
  }
}
