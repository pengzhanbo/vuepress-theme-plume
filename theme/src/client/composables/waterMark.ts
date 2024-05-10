import { defineWatermarkConfig } from '@vuepress/plugin-watermark/client'
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import type { PlumeThemePageFrontmatter } from '../../shared/index.js'

declare const __PLUME_WM_FP__: boolean

export function setupWatermark(): void {
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()

  defineWatermarkConfig(computed(() => {
    const disableFullPage = typeof frontmatter.value.watermark === 'object' && frontmatter.value.watermark.fullPage === false
    return {
      parent: !__PLUME_WM_FP__ || disableFullPage ? '.plume-content' : 'body',
    }
  }))
}
