import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { createContainerPlugin } from './createContainer.js'

interface CardAttrs {
  title?: string
  icon?: string
}

export function cardPlugin(md: Markdown) {
  /**
   * ::: card title="xxx" icon="xxx"
   * xxx
   * :::
   */
  createContainerPlugin(md, 'card', {
    before(info) {
      const { attrs } = resolveAttrs<CardAttrs>(info)
      const { title, icon } = attrs
      return `<VPCard${title ? ` title="${title}"` : ''}${icon ? ` icon="${icon}"` : ''}>`
    },
    after: () => '</VPCard>',
  })

  /**
   * :::: card-grid
   * ::: card
   * xxx
   * :::
   * ::: card
   * xxx
   * :::
   * ::::
   */
  createContainerPlugin(md, 'card-grid', {
    before: () => '<VPCardGrid>',
    after: () => '</VPCardGrid>',
  })
}
