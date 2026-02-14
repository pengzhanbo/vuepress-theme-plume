import type { Markdown } from 'vuepress/markdown'
import { createContainerPlugin } from './createContainer.js'

/**
 * Steps container plugin
 *
 * 步骤容器插件
 *
 * Syntax:
 * ```md
 * :::steps
 * 1. 步骤 1
 *    xxx
 * 2. 步骤 2
 *    xxx
 * 3. ...
 * :::
 * ```
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function stepsPlugin(md: Markdown): void {
  createContainerPlugin(md, 'steps', {
    before: () => '<div class="vp-steps">',
  })
}
