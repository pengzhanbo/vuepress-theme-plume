import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
  chainWebpack,
} from '@vuepress/helper'
import type { App } from 'vuepress'

export function extendsBundlerOptions(bundlerOptions: any, app: App): void {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 1024,
    },
  })

  addViteOptimizeDepsInclude(bundlerOptions, app, '@vueuse/core', true)
  addViteOptimizeDepsExclude(bundlerOptions, app, '@theme')

  addViteSsrNoExternal(bundlerOptions, app, [
    '@vuepress/helper',
    '@vuepress/plugin-reading-time',
    '@vuepress/plugin-watermark',
  ])

  chainWebpack(bundlerOptions, app, (config) => {
    config.module
      .rule('scss')
      .use('sass-loader')
      .tap((options: any) => ({
        api: 'modern-compiler',
        ...options,
        sassOptions: {
          silenceDeprecations: ['mixed-decls'],
          ...options.sassOptions,
        },
      }))
  })
}
