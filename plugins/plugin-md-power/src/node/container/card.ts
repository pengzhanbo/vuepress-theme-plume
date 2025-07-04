import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

interface CardAttrs {
  title?: string
  icon?: string
}

interface CardMasonryAttrs {
  cols?: number
  gap?: number
}

export function cardPlugin(md: Markdown): void {
  /**
   * ::: card title="xxx" icon="xxx"
   * xxx
   * :::
   */
  createContainerPlugin(md, 'card', {
    before(info) {
      const { attrs } = resolveAttrs<CardAttrs>(info)
      return `<VPCard${stringifyAttrs(attrs)}>`
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
      if (attrs.cols)
        attrs.cols = attrs.cols[0] === '{' ? attrs.cols : Number.parseInt(`${attrs.cols}`)
      if (attrs.gap)
        attrs.gap = Number(attrs.gap)

      return `<VPCardMasonry${stringifyAttrs(attrs)}>`
    },
    after: () => '</VPCardMasonry>',
  })
}
