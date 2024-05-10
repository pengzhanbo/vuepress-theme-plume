import { defineWatermarkConfig } from '@vuepress/plugin-watermark/client'
import { computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'
import type { PlumeThemePageFrontmatter } from '../../shared/index.js'

export function setupWatermark(): void {
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()

  defineWatermarkConfig(computed(() => ({
    parent: typeof frontmatter.value.watermark === 'object'
      ? frontmatter.value.watermark.fullPage === false ? '.plume-content' : 'body'
      : 'body',
  })))
}
