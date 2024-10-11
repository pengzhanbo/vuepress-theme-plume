/**
 * @[jsfiddle](user/id)
 * @[jsfiddle theme="dark" tab="js,css,html,result"](user/id)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { JSFiddleTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

export const jsfiddlePlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<JSFiddleTokenMeta>(md, {
    type: 'jsfiddle',
    syntaxPattern: /^@\[jsfiddle([^\]]*)\]\(([^)]*)\)/,
    meta([, info, source]) {
      const { attrs } = resolveAttrs(info)
      const [user, id] = source.split('/')

      return {
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '400px',
        user,
        id,
        title: attrs.title || 'JS Fiddle',
        tab: attrs.tab?.replace(/\s+/g, '') || 'js,css,html,result',
        theme: attrs.theme || 'dark',
      }
    },
    content: ({ title, height, width, user, id, tab, theme }) => {
      theme = theme === 'dark' ? '/dark/' : ''

      const link = `https://jsfiddle.net/${user}/${id}/embedded/${tab}${theme}`
      const style = `width:${width};height:${height};margin:16px auto;border:none;border-radius:5px;`
      return `<iframe class="js-fiddle-iframe-wrapper" style="${style}" title="${title}" src="${link}" allowfullscreen="true" allowpaymentrequest="true"></iframe>`
    },
  })
}
