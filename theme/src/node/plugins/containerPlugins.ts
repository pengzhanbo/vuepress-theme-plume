import type { Plugin } from 'vuepress/core'
import { markdownContainerPlugin as containerPlugin } from '@vuepress/plugin-markdown-container'

export const customContainerPlugins: Plugin[] = [
  /**
   * :::demo-wrapper img no-padding title="xxx" height="100px"
   * :::
   */
  containerPlugin({
    type: 'demo-wrapper',
    before(info) {
      const title = resolveAttr(info, 'title')
      const wrapperClasses: string[] = ['demo-wrapper']
      let containerStyle = ''
      if (title)
        wrapperClasses.push('has-title')

      if (info.includes('img'))
        wrapperClasses.push('only-img')

      if (info.includes('no-padding'))
        wrapperClasses.push('no-padding')

      const height = resolveAttr(info, 'height')
      if (height) {
        const h = Number.parseFloat(height) === Number(height) ? `${height}px` : height
        containerStyle += `--demo-container-height: ${h};`
        wrapperClasses.push('has-height')
      }

      return `<div class="${wrapperClasses.join(' ')}">
  <div class="demo-head">
    <div class="demo-ctrl"><i></i><i></i><i></i></div>
    ${title ? `<h4 class="demo-title"><p>${title}</p></h4>` : ''}
  </div>
  <div class="demo-container" ${containerStyle ? `style="${containerStyle}"` : ''}>\n`
    },
    after() {
      return '</div></div>'
    },
  }),
  /**
   * :::steps
   * 1. 步骤 1
   *    xxx
   * 2. 步骤 2
   *    xxx
   * 3. ...
   * :::
   */
  containerPlugin({
    type: 'steps',
    before() {
      return '<div class="vp-steps">'
    },
    after() {
      return '</div>'
    },
  }),
  /**
   * ::: card title="xxx" icon="xxx"
   * xxx
   * :::
   */
  containerPlugin({
    type: 'card',
    before(info) {
      const title = resolveAttr(info, 'title')
      const icon = resolveAttr(info, 'icon')
      return `<VPCard${title ? ` title="${title}"` : ''}${icon ? ` icon="${icon}"` : ''}>`
    },
    after() {
      return '</VPCard>'
    },
  }),

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
  containerPlugin({
    type: 'card-grid',
    before() {
      return '<VPCardGrid>'
    },
    after() {
      return '</VPCardGrid>'
    },
  }),
]

/**
 * Resolve the specified attribute from token info
 */
function resolveAttr(info: string, attr: string): string | null {
  // try to match specified attr mark
  const pattern = `\\b${attr}\\s*=\\s*(?<quote>['"])(?<content>.+?)\\k<quote>(\\s|$)`
  const regex = new RegExp(pattern, 'i')
  const match = info.match(regex)

  // return content if matched, null if not specified
  return match?.groups?.content ?? null
}
