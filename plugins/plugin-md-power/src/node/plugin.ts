import type { Plugin } from 'vuepress/core'
import type MarkdownIt from 'markdown-it'
import type { CanIUseOptions, MarkdownPowerPluginOptions } from '../shared/index.js'
import { caniusePlugin, legacyCaniuse } from './features/caniuse.js'
import { pdfPlugin } from './features/pdf.js'
import { createIconCSSWriter, iconsPlugin } from './features/icons/index.js'
import { bilibiliPlugin } from './features/video/bilibili.js'
import { youtubePlugin } from './features/video/youtube.js'
import { codepenPlugin } from './features/codepen.js'
import { replitPlugin } from './features/replit.js'
import { codeSandboxPlugin } from './features/codeSandbox.js'
import { jsfiddlePlugin } from './features/jsfiddle.js'
import { plotPlugin } from './features/plot.js'
import { langReplPlugin } from './features/langRepl.js'
import { prepareConfigFile } from './prepareConfigFile.js'

export function markdownPowerPlugin(options: MarkdownPowerPluginOptions = {}): Plugin {
  return (app) => {
    const { initIcon, addIcon } = createIconCSSWriter(app, options.icons)

    return {
      name: 'vuepress-plugin-md-power',

      // clientConfigFile: path.resolve(__dirname, '../client/config.js'),
      clientConfigFile: app => prepareConfigFile(app, options),

      define: {
        __MD_POWER_INJECT_OPTIONS__: options,
      },

      onInitialized: async () => await initIcon(),

      extendsMarkdown: async (md: MarkdownIt, app) => {
        if (options.caniuse) {
          const caniuse = options.caniuse === true ? {} : options.caniuse
          // @[caniuse](feature_name)
          md.use<CanIUseOptions>(caniusePlugin, caniuse)
          // 兼容旧语法
          legacyCaniuse(md, caniuse)
        }

        if (options.pdf) {
          // @[pdf](url)
          md.use(pdfPlugin)
        }

        if (options.icons) {
          // :[collect:name]:
          md.use(iconsPlugin, addIcon)
        }

        if (options.bilibili) {
          // @[bilibili](bvid aid cid)
          md.use(bilibiliPlugin)
        }

        if (options.youtube) {
          // @[youtube](id)
          md.use(youtubePlugin)
        }

        if (options.codepen) {
          // @[codepen](user/slash)
          md.use(codepenPlugin)
        }

        if (options.replit) {
          // @[replit](user/repl-name)
          md.use(replitPlugin)
        }

        if (options.codeSandbox) {
          // @[codesandbox](id)
          md.use(codeSandboxPlugin)
        }

        if (options.jsfiddle) {
          // @[jsfiddle](user/id)
          md.use(jsfiddlePlugin)
        }

        if (
          options.plot === true
          || (typeof options.plot === 'object' && options.plot.tag !== false)
        ) {
          // =|plot|=
          md.use(plotPlugin)
        }

        if (options.repl)
          await langReplPlugin(app, md, options.repl)
      },
    }
  }
}
