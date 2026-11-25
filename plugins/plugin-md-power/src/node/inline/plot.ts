/**
 * !!这里的文本将被黑幕隐藏，通过点击或者 hover 才可重现!!
 *
 * !!The text here will be hidden by a spoiler, and can only be revealed by clicking or hovering!!
 */

import type { Markdown } from 'vuepress/markdown'
import { inlineRule } from '@mdit/plugin-inline-rule'

/**
 * Plot plugin - Hide text with spoiler effect
 *
 * 黑幕插件 - 使用黑幕效果隐藏文本
 *
 * Syntax: !!hidden text!!
 * 语法：!!隐藏文本!!
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 */
export function plotPlugin(md: Markdown) {
  inlineRule(md, {
    marker: '!',
    tag: 'VPPlot',
    token: 'plot',
    nested: true,
    double: true,
    placement: 'before-emphasis',
  })
}
