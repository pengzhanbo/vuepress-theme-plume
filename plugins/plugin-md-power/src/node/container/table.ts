import type { Markdown } from 'vuepress/markdown'
import type { TableContainerOptions } from '../../shared/table.js'
import { encodeData } from '@vuepress/helper'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

export interface TableContainerAttrs extends TableContainerOptions {
  title?: string
}

/**
 *  在不破坏表格语法的前提下，通过容器语法将表格包裹起来，为表格提供增强功能
 */
export function tablePlugin(md: Markdown, options: TableContainerOptions = {}): void {
  createContainerSyntaxPlugin(md, 'table', (tokens, index, _, env) => {
    const meta = { copy: true, maxContent: false, ...options, ...tokens[index].meta } as TableContainerAttrs & { markdown?: string }
    const content = tokens[index].content

    if (meta.copy) {
      meta.copy = meta.copy === true ? 'all' : meta.copy

      if (meta.copy === 'all' || meta.copy === 'md') {
        meta.markdown = encodeData(content.trim())
      }
    }

    return `<VPTable ${stringifyAttrs(meta)}>${md.render(content, env)}</VPTable>`
  })
}
