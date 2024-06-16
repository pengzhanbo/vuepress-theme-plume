import { defineWatermarkConfig } from '@vuepress/plugin-watermark/client'
import { computed } from 'vue'
import { useData } from './data.js'

declare const __PLUME_WM_FP__: boolean

const FP = __PLUME_WM_FP__

export function setupWatermark(): void {
  const { frontmatter } = useData()

  defineWatermarkConfig(computed(() => {
    const disableFullPage = typeof frontmatter.value.watermark === 'object' && frontmatter.value.watermark.fullPage === false
    return {
      parent: !FP || disableFullPage ? '.vp-doc' : 'body',
    }
  }))
}
