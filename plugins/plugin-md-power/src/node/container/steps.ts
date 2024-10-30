import type { Markdown } from 'vuepress/markdown'
import { createContainerPlugin } from './createContainer.js'

/**
 * :::steps
 * 1. 步骤 1
 *    xxx
 * 2. 步骤 2
 *    xxx
 * 3. ...
 * :::
 */
export function stepsPlugin(md: Markdown) {
  createContainerPlugin(md, 'steps', {
    before: () => '<div class="vp-steps">',
  })
}
