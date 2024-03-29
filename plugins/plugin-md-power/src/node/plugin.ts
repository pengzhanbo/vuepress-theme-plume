import type { Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import type { CanIUseOptions, MarkdownPowerPluginOptions } from '../shared/index.js'
import { caniusePlugin, legacyCaniuse } from './features/caniuse.js'
import { pdfPlugin } from './features/pdf.js'
import { createIconCSSWriter, iconsPlugin } from './features/icons/index.js'
import { bilibiliPlugin } from './features/video/bilibili.js'
import { youtubePlugin } from './features/video/youtube.js'
import { codepenPlugin } from './features/codepen.js'

const __dirname = getDirname(import.meta.url)

export function markdownPowerPlugin(options: MarkdownPowerPluginOptions = {}): Plugin {
  return (app) => {
    const { initIcon, addIcon } = createIconCSSWriter(app, options.icons)

    return {
      name: '@vuepress-plume/plugin-md-power',

      clientConfigFile: path.resolve(__dirname, '../client/config.js'),

      define: {
        __MD_POWER_INJECT_OPTIONS__: options,
      },

      onInitialized: async () => await initIcon(),

      extendsMarkdown(md) {
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
      },
    }
  }
}
