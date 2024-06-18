import { addViteConfig, addViteOptimizeDepsInclude, addViteSsrNoExternal } from '@vuepress/helper'
import type { App } from 'vuepress'

export function extendsBundlerOptions(bundlerOptions: any, app: App): void {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 1024,
    },
  })

  addViteOptimizeDepsInclude(bundlerOptions, app, '@vueuse/core', true)

  addViteSsrNoExternal(bundlerOptions, app, [
    '@vuepress/helper',
    '@vuepress/plugin-reading-time',
    '@vuepress/plugin-watermark',
  ])
}
