import type { App } from 'vuepress'
import {
  addViteConfig,
  addViteOptimizeDepsExclude,
  addViteOptimizeDepsInclude,
  addViteSsrNoExternal,
} from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'

// 动态加载的依赖
const dynamicImport = ['artplayer', 'dashjs', 'hls.js', 'mpegts.js', 'shiki', 'pyodide', 'qrcode', 'artalk', 'giscus', 'twikoo', '@waline', 'photoswipe', 'chart.js', 'echarts', 'flowchart.ts', 'markmap', 'mermaid', 'katex', 'register-service-worker', '@docsearch']
const VUE_REG = /node_modules[\\/](?:@?vue[\\/]|vue-router|floating-vue)/

function excludeDynamicImport(id: string) {
  if (id.includes('node_modules')) {
    const mod = id.slice(id.indexOf('node_modules') + 13)
    return !dynamicImport.some(item => mod.includes(item))
  }
  return undefined
}

/**
 * 代码分割策略
 */
const codeSplittingGroups = [
  // 仅包含于 vue 相关的外部依赖：[vue, vue-router, @vueuse/*, floating-vue]
  {
    name: 'vue',
    test: (id: string) => {
      if (id.includes('node_modules')) {
        const mod = id.slice(id.indexOf('node_modules') + 13)
        return VUE_REG.test(mod)
      }
      return undefined
    },
    priority: 100,
  },
  // 公共基础依赖（排除 vue 相关、import() 语句异步加载的依赖）
  {
    name: 'vendor',
    test: excludeDynamicImport,
    priority: 90,
    entriesAware: true,
    minModuleSize: 28000,
    entriesAwareMergeThreshold: 100000,
  },
  // 复用次数大于 3 的模块
  {
    name: 'common',
    test: (id: string) => excludeDynamicImport(id) ?? true,
    priority: 10,
    minShareCount: 3,
    minSize: 100000,
  },
]

export function extendsBundlerOptions(bundlerOptions: unknown, app: App): void {
  addViteConfig(bundlerOptions, app, {
    build: {
      chunkSizeWarningLimit: 2048, // 单文件超过 2 MB 则警告
      rolldownOptions: {
        output: { codeSplitting: { groups: codeSplittingGroups } },
      },
    },
  })

  addViteOptimizeDepsInclude(
    bundlerOptions,
    app,
    ['@vueuse/core', '@vueuse/integrations/useFocusTrap', 'hash-wasm', '@vuepress/helper/client', '@iconify/vue', '@iconify/vue/offline', '@vuepress/plugin-git/client', '@vuepress/plugin-markdown-chart/client'],
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
