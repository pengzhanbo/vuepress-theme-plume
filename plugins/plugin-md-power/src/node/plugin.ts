import type { Plugin } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { isPlainObject } from '@pengzhanbo/utils'
import { addViteOptimizeDepsInclude } from '@vuepress/helper'
import { extendsPageWithCodeTree } from './container/codeTree.js'
import { containerPlugin } from './container/index.js'
import { demoPlugin, demoWatcher, extendsPageWithDemo, waitDemoRender } from './demo/index.js'
import { embedSyntaxPlugin } from './embed/index.js'
import { docsTitlePlugin } from './enhance/docsTitle.js'
import { imageSizePlugin } from './enhance/imageSize.js'
import { linksPlugin } from './enhance/links.js'
import { iconPlugin } from './icon/index.js'
import { inlineSyntaxPlugin } from './inline/index.js'
import { prepareConfigFile } from './prepareConfigFile.js'
import { provideData } from './provideData.js'

export function markdownPowerPlugin(
  options: MarkdownPowerPluginOptions = {},
): Plugin {
  return {
    name: 'vuepress-plugin-md-power',

    clientConfigFile: app => prepareConfigFile(app, options),

    define: app => provideData(app, options),

    alias: {
      ...options.encrypt ? { vue: 'vue/dist/vue.esm-bundler.js' } : undefined,
    },

    extendsBundlerOptions(bundlerOptions, app) {
      if (options.repl) {
        addViteOptimizeDepsInclude(
          bundlerOptions,
          app,
          ['shiki/core', 'shiki/wasm', 'shiki/engine/oniguruma'],
        )

        if (options.repl.python)
          addViteOptimizeDepsInclude(bundlerOptions, app, ['pyodide'])
      }
      if (options.artPlayer) {
        addViteOptimizeDepsInclude(
          bundlerOptions,
          app,
          ['artplayer', 'dashjs', 'hls.js', 'mpegts.js/dist/mpegts.js'],
        )
      }
      if (options.qrcode) {
        addViteOptimizeDepsInclude(bundlerOptions, app, ['qrcode'])
      }
    },

    extendsMarkdown: async (md, app) => {
      linksPlugin(md)
      docsTitlePlugin(md)
      embedSyntaxPlugin(md, options)
      inlineSyntaxPlugin(md, options)
      iconPlugin(md, options.icon ?? (isPlainObject(options.icons) ? options.icons : {}))

      if (options.demo)
        demoPlugin(app, md)

      await containerPlugin(app, md, options)
      await imageSizePlugin(app, md, options.imageSize)
    },

    onPrepared: async () => {
      if (options.demo)
        await waitDemoRender()
    },

    onWatched(app, watchers) {
      if (options.demo) {
        demoWatcher(app, watchers)
      }
    },

    extendsPage: (page) => {
      if (options.demo)
        extendsPageWithDemo(page)

      if (options.codeTree)
        extendsPageWithCodeTree(page)
    },
  }
}
