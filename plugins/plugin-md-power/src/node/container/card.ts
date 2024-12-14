import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { createContainerPlugin } from './createContainer.js'

interface CardAttrs {
  title?: string
  icon?: string
}

interface CardMasonryAttrs {
  cols?: number
  gap?: number
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

  /**
   * ::: card-masonry cols="2" gap="10"
   * ::: card
   * xxx
   * :::
   * ::: card
   * xxx
   * :::
   * ::::
   */
  createContainerPlugin(md, 'card-masonry', {
    before: (info) => {
      const { attrs } = resolveAttrs<CardMasonryAttrs>(info)
      let cols!: string | number
      if (attrs.cols) {
        cols = attrs.cols[0] === '{' ? attrs.cols : Number.parseInt(`${attrs.cols}`)
      }
      const gap = Number.parseInt(`${attrs.gap}`)

      return `<VPCardMasonry${cols ? ` :cols="${cols}"` : ''}${gap >= 0 ? ` :gap="${gap}"` : ''}>`
    },
    after: () => '</VPCardMasonry>',
  })
}
