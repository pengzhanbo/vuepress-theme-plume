import type { Markdown } from 'vuepress/markdown'
import { inlineRule } from '@mdit/plugin-inline-rule'

/**
 * Mark plugin
 *
 * Mark 插件
 *
 * Syntax: ==mark text==
 * 语法：==mark 文本==
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 */
export function markPlugin(md: Markdown) {
  inlineRule(md, {
    marker: '=',
    tag: 'VPMark',
    token: 'mark',
    nested: true,
    double: true,
    placement: 'before-emphasis',
  })
}
