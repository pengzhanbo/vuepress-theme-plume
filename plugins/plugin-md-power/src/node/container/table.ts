import type { Markdown } from 'vuepress/markdown'
import type { TableContainerOptions } from '../../shared/table.js'
import { encodeData } from '@vuepress/helper'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

export interface TableContainerAttrs extends TableContainerOptions {
  /**
   * 表格标题
   */
  title?: string

  /**
   * 表格高亮的行
   *
   * @example hl-rows="warning:1,2,3;error:4,5,6"
   */
  hlRows?: string
  /**
   * 表格高亮的列
   *
   * @example hl-cols="warning:1;error:2,3"
   */
  hlCols?: string

  /**
   * 表格高亮的单元格
   *
   * @example hl-cells="warning:(1,2)(2,3);error:(3,4)(4,5)"
   */
  hlCells?: string
}

/**
 *  在不破坏表格语法的前提下，通过容器语法将表格包裹起来，为表格提供增强功能
 *
 * @example
 * ```md
 * ::: table title="表格标题" max-content copy align="center" hl-rows="warning:1,2,3;error:4,5,6" hl-cols="warning:1;error:2,3" hl-cells="warning:(1,2)(2,3);"
 *
 * | xx | xx | xx |
 * | -- | -- | -- |
 * | xx | xx | xx |
 * :::
 * ```
 */
export function tablePlugin(md: Markdown, options: TableContainerOptions = {}): void {
  createContainerSyntaxPlugin(md, 'table', (tokens, index, opt, env) => {
    const { hlCols = '', hlRows = '', hlCells = '', ...meta } = tokens[index].meta as TableContainerAttrs
    const props = { copy: true, maxContent: false, ...options, ...meta } as TableContainerAttrs & { markdown?: string }
    const content = tokens[index].content

    if (props.copy) {
      props.copy = props.copy === true ? 'all' : props.copy

      if (props.copy === 'all' || props.copy === 'md') {
        props.markdown = encodeData(content.trim())
      }
    }

    if (!hlCols && !hlRows && !hlCells) {
      return `<VPTable ${stringifyAttrs(props)}>${md.render(content, env)}</VPTable>`
    }

    const rows = parseHl(hlRows)
    const cols = parseHl(hlCols)
    const cells = parseHlCells(hlCells)

    const tableTokens = md.parse(content, env)
    let isTable = false
    let colIndex = 0
    let rowIndex = 0
    for (const token of tableTokens) {
      if (token.type === 'table_open')
        isTable = true
      if (token.type === 'table_close')
        isTable = false
      if (!isTable)
        continue

      // row
      if (token.type === 'tr_open') {
        rowIndex++
        colIndex = 0
      }
      // cell (rowIndex, colIndex)
      if (token.type === 'th_open' || token.type === 'td_open') {
        colIndex++
        const classes = cells[rowIndex]?.[colIndex] || rows[rowIndex] || cols[colIndex]
        if (classes)
          token.attrJoin('class', classes)
      }
    }

    return `<VPTable ${stringifyAttrs(props)}>${md.renderer.render(tableTokens, opt, env)}</VPTable>`
  })
}

function parseHl(hl: string) {
  const res: Record<number, string> = {}
  if (!hl)
    return res

  hl
    .split(';')
    .forEach((item) => {
      const [key, value = '1'] = item.split(':')
      String(value).split(',').forEach(v => res[v.trim()] = key.trim())
    })
  return res
}

function parseHlCells(hl: string) {
  const res: Record<string, Record<number, string>> = {}
  if (!hl)
    return res

  hl
    .split(';')
    .forEach((item) => {
      const [key, value = ''] = item.split(':')
      value.trim().replace(/\s*\((\d+)\s*,\s*(\d+)\)\s*/g, (_, row, col) => {
        res[row] ??= {}
        res[row][col] = key.trim()
        return ''
      })
    })
  return res
}
