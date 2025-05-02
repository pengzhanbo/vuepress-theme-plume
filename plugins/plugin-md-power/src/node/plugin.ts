import type { Plugin } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { addViteOptimizeDepsInclude } from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import { extendsPageWithCodeTree } from './container/codeTree.js'
import { containerPlugin } from './container/index.js'
import { demoPlugin, demoWatcher, extendsPageWithDemo, waitDemoRender } from './demo/index.js'
import { embedSyntaxPlugin } from './embed/index.js'
import { docsTitlePlugin } from './enhance/docsTitle.js'
import { imageSizePlugin } from './enhance/imageSize.js'
import { inlineSyntaxPlugin } from './inline/index.js'
import { prepareConfigFile } from './prepareConfigFile.js'

export function markdownPowerPlugin(
  options: MarkdownPowerPluginOptions = {},
): Plugin {
  return {
    name: 'vuepress-plugin-md-power',

    clientConfigFile: app => prepareConfigFile(app, options),

    define: {
      __MD_POWER_INJECT_OPTIONS__: options,
      __MD_POWER_DASHJS_INSTALLED__: isPackageExists('dashjs'),
      __MD_POWER_HLSJS_INSTALLED__: isPackageExists('hls.js'),
      __MD_POWER_MPEGTSJS_INSTALLED__: isPackageExists('mpegts.js'),
    },

    extendsBundlerOptions(bundlerOptions, app) {
      if (options.repl) {
        addViteOptimizeDepsInclude(
          bundlerOptions,
          app,
          ['shiki/core', 'shiki/wasm', 'shiki/engine/oniguruma'],
        )
      }
      if (options.artPlayer) {
        addViteOptimizeDepsInclude(
          bundlerOptions,
          app,
          ['artplayer', 'dashjs', 'hls.js', 'mpegts.js/dist/mpegts.js'],
        )
      }
    },

    extendsMarkdown: async (md, app) => {
      docsTitlePlugin(md)
      embedSyntaxPlugin(md, options)
      inlineSyntaxPlugin(md, options)

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
