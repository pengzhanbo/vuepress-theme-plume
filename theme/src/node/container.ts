import { containerPlugin } from '@vuepress/plugin-container'
import type { Plugin } from 'vuepress/core'

export const customContainers: Plugin[] = [
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
      return '</div></div>\n'
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
