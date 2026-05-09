import type { App } from 'vuepress'
import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
} from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'

export function extendsBundlerOptions(bundlerOptions: any, app: App): void {
  const dynamicImport = ['artplayer', 'dashjs', 'hls.js', 'mpegts.js', 'shiki', 'pyodide', 'qrcode', 'artalk', 'giscus', 'twikoo', '@waline', 'photoswipe', 'chart.js', 'echarts', 'flowchart.ts', 'markmap', 'mermaid', 'katex', 'register-service-worker', '@docsearch']
  const VUE_REG = /node_modules[\\/](?:@?vue[\\/]|vue-router|floating-vue)/

  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 2048,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'vue', test: (id: string) => {
                if (id.includes('node_modules')) {
                  const mod = id.slice(id.indexOf('node_modules') + 13)
                  return VUE_REG.test(mod)
                }
                return undefined
              }, priority: 100 },
              {
                name: 'vendor',
                test: (id: string) => {
                  if (id.includes('node_modules')) {
                    const mod = id.slice(id.indexOf('node_modules') + 13)
                    return !dynamicImport.some(item => mod.includes(item))
                  }
                  return undefined
                },
                priority: 90,
                entriesAware: true,
                minModuleSize: 28000,
                entriesAwareMergeThreshold: 100000,
              },
              { name: 'common', minShareCount: 3, minSize: 100000, priority: 10 },
            ],
          },
        },
      },
    },
  })

  addViteOptimizeDepsInclude(
    bundlerOptions,
    app,
    ['@vueuse/core', 'hash-wasm', '@vuepress/helper/client', '@iconify/vue', '@iconify/vue/offline', '@vuepress/plugin-git/client', '@vuepress/plugin-markdown-chart/client'],
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

  if (isPackageExists('three')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ['three', 'three/src/math/MathUtils.js'])
    addViteSsrNoExternal(bundlerOptions, app, ['three', 'three/src/math/MathUtils.js'])
  }

  if (isPackageExists('gsap')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ['gsap', 'gsap/InertiaPlugin'])
    addViteSsrNoExternal(bundlerOptions, app, ['gsap', 'gsap/InertiaPlugin'])
  }

  if (isPackageExists('postprocessing')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ['postprocessing'])
    addViteSsrNoExternal(bundlerOptions, app, ['postprocessing'])
  }

  if (isPackageExists('ogl')) {
    addViteOptimizeDepsInclude(bundlerOptions, app, ['ogl'])
    addViteSsrNoExternal(bundlerOptions, app, ['ogl'])
  }
}
