import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
  chainWebpack,
} from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import type { App } from 'vuepress'

export function extendsBundlerOptions(bundlerOptions: any, app: App): void {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 2048,
    },
  })

  addViteOptimizeDepsInclude(bundlerOptions, app, '@vueuse/core', true)
  addViteOptimizeDepsExclude(bundlerOptions, app, '@theme')

  addViteSsrNoExternal(bundlerOptions, app, [
    '@vuepress/helper',
    '@vuepress/plugin-reading-time',
    '@vuepress/plugin-watermark',
  ])

  if (isPackageExists('swiper')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, 'swiper', true)
    addViteSsrNoExternal(bundlerOptions, app, ['swiper'])
  }

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

  addViteConfig(bundlerOptions, app, {
    css: {
      preprocessorOptions: {
        sass: {
          logger: {
            warn: (message, { deprecation, deprecationType }) => {
              if (deprecation && deprecationType.id === 'mixed-decls')
                return

              console.warn(message)
            },
          },
        },
        scss: {
          logger: {
            warn: (message, { deprecation, deprecationType }) => {
              if (deprecation && deprecationType.id === 'mixed-decls')
                return
              if (!message.includes('repetitive deprecation warnings omitted')) {
                console.warn(message)
              }
            },
          },
        },
      },
    },
  })
}
