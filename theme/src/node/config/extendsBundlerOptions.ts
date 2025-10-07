import type { App } from 'vuepress'
import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
} from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'

export function extendsBundlerOptions(bundlerOptions: any, app: App): void {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 2048,
    },
  })

  addViteOptimizeDepsInclude(
    bundlerOptions,
    app,
    ['@vueuse/core', 'bcrypt-ts/browser', '@vuepress/helper/client', '@iconify/vue', '@iconify/vue/offline', '@vuepress/plugin-git/client', '@vuepress/plugin-markdown-chart/client'],
  )
  addViteOptimizeDepsExclude(bundlerOptions, app, '@theme')

  addViteSsrNoExternal(bundlerOptions, app, [
    '@vuepress/helper',
    '@vuepress/plugin-reading-time',
    '@vuepress/plugin-watermark',
  ])

  if (isPackageExists('swiper')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ['swiper/modules', 'swiper/vue'])
    addViteSsrNoExternal(bundlerOptions, app, ['swiper'])
  }
}
