import type { Plugin } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { isPlainObject } from '@pengzhanbo/utils'
import { addViteOptimizeDepsInclude } from '@vuepress/helper'
import { getFullLocaleConfig } from '@vuepress/helper'
import { extendsPageWithCodeTree } from './container/codeTree.js'
import { containerPlugin } from './container/index.js'
import { demoPlugin, demoWatcher, extendsPageWithDemo, waitDemoRender } from './demo/index.js'
import { embedSyntaxPlugin } from './embed/index.js'
import { docsTitlePlugin } from './enhance/docsTitle.js'
import { imageSizePlugin } from './enhance/imageSize.js'
import { linksPlugin } from './enhance/links.js'
import { iconPlugin } from './icon/index.js'
import { inlineSyntaxPlugin } from './inline/index.js'
import { LOCALE_OPTIONS } from './locales/index.js'
import { obsidianPlugin, updatePagePaths } from './obsidian/index.js'
import { prepareConfigFile } from './prepareConfigFile.js'
import { provideData } from './provideData.js'

/**
 * Create markdown power plugin for VuePress.
 *
 * 为 VuePress 创建 markdown 增强插件。
 *
 * This plugin provides various markdown enhancements including:
 * - Custom containers (tabs, collapse, timeline, etc.)
 * - Code blocks enhancements (code tabs, file tree, demo)
 * - Embed syntax (video, PDF, code playground)
 * - Inline syntax (mark, subscript, superscript, footnote)
 * - Icon support
 *
 * 该插件提供多种 markdown 增强功能，包括：
 * - 自定义容器（标签页、折叠面板、时间线等）
 * - 代码块增强（代码标签页、文件树、演示）
 * - 嵌入语法（视频、PDF、代码游乐场）
 * - 行内语法（标记、下标、上标、脚注）
 * - 图标支持
 *
 * @param options - Plugin options / 插件配置选项
 * @returns VuePress plugin instance / VuePress 插件实例
 *
 * @example
 * ```ts
 * // Basic usage
 * markdownPowerPlugin()
 *
 * // With options
 * markdownPowerPlugin({
 *   tabs: true,
 *   collapse: true,
 *   pdf: true,
 * })
 * ```
 */
export function markdownPowerPlugin(
  options: MarkdownPowerPluginOptions = {},
): Plugin {
  return (app) => {
    const locales = getFullLocaleConfig({
      app,
      name: 'vuepress-plugin-md-power',
      default: LOCALE_OPTIONS,
      config: options.locales,
    })

    return {
      name: 'vuepress-plugin-md-power',

      clientConfigFile: app => prepareConfigFile(app, options),

      define: provideData(options, locales),

      alias: (_, isServer) => {
        if (!isServer) {
          return { ...options.encrypt ? { '/^vue$/': 'vue/dist/vue.esm-bundler.js' } : undefined }
        }
        return {}
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

        await containerPlugin(app, md, options, locales)
        await imageSizePlugin(app, md, options.imageSize)

        obsidianPlugin(app, md, options)
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

      onPageUpdated(_app, type, newPage, oldPage) {
        if (type === 'create')
          updatePagePaths(newPage?.filePathRelative ?? '', 'create')
        if (type === 'delete')
          updatePagePaths(oldPage?.filePathRelative ?? newPage?.filePathRelative ?? '', 'delete')
      },
    }
  }
}
