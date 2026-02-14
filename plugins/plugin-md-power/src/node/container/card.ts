import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Card container attributes
 *
 * 卡片容器属性
 */
interface CardAttrs {
  title?: string
  icon?: string
}

/**
 * Card masonry container attributes
 *
 * 卡片瀑布流容器属性
 */
interface CardMasonryAttrs {
  cols?: number
  gap?: number
}

/**
 * Card plugin - Enable card containers
 *
 * 卡片插件 - 启用卡片容器
 *
 * Syntax:
 * - ::: card title="xxx" icon="xxx"
 * - ::: card-grid
 * - ::: card-masonry cols="2" gap="10"
 *
 * @param md - Markdown instance / Markdown 实例
 */
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
